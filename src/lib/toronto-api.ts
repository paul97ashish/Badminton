import { sportSlugForTitle } from "./sports";

const CKAN_BASE = "https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action";
const DROPIN_RESOURCE_ID = "c99ec04f-4540-482c-9ee4-efb38774eab4";
const LOCATIONS_RESOURCE_ID = "f23ac1ad-6f46-4b59-811f-eb34be9b1f7a";
const FACILITIES_GEO_RESOURCE_ID = "e8cd0f4d-4910-42a0-81f9-cf8c2218753a";

interface DatastoreSearchResponse<T> {
  success: boolean;
  result: {
    records: T[];
    total: number;
  };
}

interface DropInRecord {
  "Location ID": number;
  Course_ID: number;
  "Course Title": string;
  Section: string;
  "Age Min": string;
  "Age Max": string;
  "Start Hour": number;
  "Start Minute": number;
  "End Hour": number;
  "End Min": number;
  "First Date": string;
  "Last Date": string;
  DayOftheWeek: string;
}

interface LocationRecord {
  "Location ID": number;
  "Location Name": string;
  "Location Type": string;
  Accessibility: string;
  Intersection: string;
  District: string;
  "Street No": string;
  "Street No Suffix": string;
  "Street Name": string;
  "Street Type": string;
  "Street Direction": string;
  "Postal Code": string;
}

interface FacilityGeoRecord {
  LOCATIONID: string;
  geometry: string;
}

export type TimeOfDay = "morning" | "afternoon" | "evening";

export interface DropInSession {
  id: string;
  courseId: number;
  sportSlug: string;
  courseTitle: string;
  ageMin: number | null;
  ageMax: number | null;
  ageLabel: string;
  dayOfWeek: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  timeOfDay: TimeOfDay;
  location: {
    id: number;
    name: string;
    district: string;
    address: string;
    mapUrl: string;
    siteUrl: string;
    lat: number | null;
    lng: number | null;
  };
}

async function datastoreSearch<T>(
  resourceId: string,
  params: Record<string, string>
): Promise<T[]> {
  const url = new URL(`${CKAN_BASE}/datastore_search`);
  url.searchParams.set("resource_id", resourceId);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Toronto Open Data request failed: ${res.status}`);
  }
  const data = (await res.json()) as DatastoreSearchResponse<T>;
  return data.result.records;
}

function timeOfDayFromHour(hour: number): TimeOfDay {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function formatAgeLabel(ageMin: string, ageMax: string): string {
  const min = ageMin === "None" ? null : ageMin;
  const max = ageMax === "None" ? null : ageMax;

  if (min && max) return `${min}-${max} years`;
  if (min && !max) return `${min} years and over`;
  if (!min && max) return `Up to ${max} years`;
  return "All ages";
}

// The Locations dataset is inconsistent about this district's name;
// both spellings refer to the same administrative district.
function normalizeDistrict(district: string): string {
  if (district === "Toronto East York") return "Toronto and East York";
  return district;
}

function formatAddress(loc: LocationRecord): string {
  const parts = [
    loc["Street No"] !== "None" ? loc["Street No"] : "",
    loc["Street No Suffix"] !== "None" ? loc["Street No Suffix"] : "",
    loc["Street Name"] !== "None" ? loc["Street Name"] : "",
    loc["Street Type"] !== "None" ? loc["Street Type"] : "",
    loc["Street Direction"] !== "None" ? loc["Street Direction"] : "",
  ].filter(Boolean);
  return parts.join(" ");
}

async function getFacilityCoordinates(
  locationIds: number[]
): Promise<Map<number, { lat: number; lng: number }>> {
  const records = await datastoreSearch<FacilityGeoRecord>(
    FACILITIES_GEO_RESOURCE_ID,
    {
      filters: JSON.stringify({
        LOCATIONID: locationIds.map((id) => String(id)),
      }),
      limit: String(locationIds.length),
    }
  );

  const coordsById = new Map<number, { lat: number; lng: number }>();
  for (const record of records) {
    try {
      const geometry = JSON.parse(record.geometry) as {
        coordinates: [number, number];
      };
      const [lng, lat] = geometry.coordinates;
      coordsById.set(Number(record.LOCATIONID), { lat, lng });
    } catch {
      // Skip records with malformed geometry
    }
  }
  return coordsById;
}

// All recognized drop-in sessions for a date, across every sport category.
// One fetch per date serves every sport page via Next's fetch cache.
export async function getSessionsForDate(
  date: string
): Promise<DropInSession[]> {
  const dropInRecords = await datastoreSearch<DropInRecord>(
    DROPIN_RESOURCE_ID,
    {
      filters: JSON.stringify({ "First Date": date }),
      limit: "5000",
    }
  );

  const recognized = dropInRecords
    .map((record) => ({
      record,
      sportSlug: sportSlugForTitle(record["Course Title"]),
    }))
    .filter((r): r is { record: DropInRecord; sportSlug: string } =>
      Boolean(r.sportSlug)
    );

  if (recognized.length === 0) return [];

  const locationIds = Array.from(
    new Set(recognized.map((r) => r.record["Location ID"]))
  );

  const [locationRecords, coordsById] = await Promise.all([
    datastoreSearch<LocationRecord>(LOCATIONS_RESOURCE_ID, {
      filters: JSON.stringify({ "Location ID": locationIds }),
      limit: String(locationIds.length),
    }),
    getFacilityCoordinates(locationIds),
  ]);

  const locationsById = new Map(
    locationRecords.map((loc) => [loc["Location ID"], loc])
  );

  const sessions: DropInSession[] = recognized
    .map(({ record, sportSlug }) => {
      const loc = locationsById.get(record["Location ID"]);
      if (!loc) return null;

      const address = formatAddress(loc);
      const mapQuery = encodeURIComponent(`${loc["Location Name"]} ${address} Toronto`);
      const coords = coordsById.get(loc["Location ID"]) ?? null;

      const session: DropInSession = {
        id: `${record.Course_ID}-${record["First Date"]}-${record["Start Hour"]}${record["Start Minute"]}`,
        courseId: record.Course_ID,
        sportSlug,
        courseTitle: record["Course Title"],
        ageMin: record["Age Min"] === "None" ? null : Number(record["Age Min"]),
        ageMax: record["Age Max"] === "None" ? null : Number(record["Age Max"]),
        ageLabel: formatAgeLabel(record["Age Min"], record["Age Max"]),
        dayOfWeek: record.DayOftheWeek,
        startHour: record["Start Hour"],
        startMinute: record["Start Minute"],
        endHour: record["End Hour"],
        endMinute: record["End Min"],
        timeOfDay: timeOfDayFromHour(record["Start Hour"]),
        location: {
          id: loc["Location ID"],
          name: loc["Location Name"],
          district: normalizeDistrict(loc.District),
          address,
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
          siteUrl: `https://www.toronto.ca/explore-enjoy/parks-recreation/places-spaces/parks-and-recreation-facilities/location/?id=${loc["Location ID"]}`,
          lat: coords?.lat ?? null,
          lng: coords?.lng ?? null,
        },
      };
      return session;
    })
    .filter((s): s is DropInSession => s !== null);

  sessions.sort((a, b) => {
    const aMinutes = a.startHour * 60 + a.startMinute;
    const bMinutes = b.startHour * 60 + b.startMinute;
    return aMinutes - bMinutes;
  });

  return sessions;
}

export async function getSportSessions(
  sportSlug: string,
  date: string
): Promise<DropInSession[]> {
  const all = await getSessionsForDate(date);
  return all.filter((s) => s.sportSlug === sportSlug);
}

export async function getSportCounts(
  date: string
): Promise<Map<string, number>> {
  const all = await getSessionsForDate(date);
  const counts = new Map<string, number>();
  for (const session of all) {
    counts.set(session.sportSlug, (counts.get(session.sportSlug) ?? 0) + 1);
  }
  return counts;
}
