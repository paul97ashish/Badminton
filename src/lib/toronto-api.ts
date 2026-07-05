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

export interface BadmintonSession {
  id: string;
  courseId: number;
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

export async function getBadmintonSessions(
  date: string
): Promise<BadmintonSession[]> {
  const dropInRecords = await datastoreSearch<DropInRecord>(
    DROPIN_RESOURCE_ID,
    {
      filters: JSON.stringify({
        "Course Title": "Badminton",
        "First Date": date,
      }),
      limit: "1000",
    }
  );

  if (dropInRecords.length === 0) return [];

  const locationIds = Array.from(
    new Set(dropInRecords.map((r) => r["Location ID"]))
  );

  const locationRecords = await datastoreSearch<LocationRecord>(
    LOCATIONS_RESOURCE_ID,
    {
      filters: JSON.stringify({ "Location ID": locationIds }),
      limit: String(locationIds.length),
    }
  );

  const locationsById = new Map(
    locationRecords.map((loc) => [loc["Location ID"], loc])
  );

  const coordsById = await getFacilityCoordinates(locationIds);

  const sessions: BadmintonSession[] = dropInRecords
    .map((record) => {
      const loc = locationsById.get(record["Location ID"]);
      if (!loc) return null;

      const address = formatAddress(loc);
      const mapQuery = encodeURIComponent(`${loc["Location Name"]} ${address} Toronto`);
      const coords = coordsById.get(loc["Location ID"]) ?? null;

      const session: BadmintonSession = {
        id: `${record.Course_ID}-${record["First Date"]}-${record["Start Hour"]}${record["Start Minute"]}`,
        courseId: record.Course_ID,
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
          district: loc.District,
          address,
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
          lat: coords?.lat ?? null,
          lng: coords?.lng ?? null,
        },
      };
      return session;
    })
    .filter((s): s is BadmintonSession => s !== null);

  sessions.sort((a, b) => {
    const aMinutes = a.startHour * 60 + a.startMinute;
    const bMinutes = b.startHour * 60 + b.startMinute;
    return aMinutes - bMinutes;
  });

  return sessions;
}
