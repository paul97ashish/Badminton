import { TimeOfDay } from "./toronto-api";

export interface FilterParams {
  time: TimeOfDay[];
  age: string[];
  zone: string[];
}

const VALID_TIMES: TimeOfDay[] = ["morning", "afternoon", "evening"];

function parseList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value[0] : value;
  return raw.split(",").filter(Boolean);
}

export function parseFilterParams(searchParams: {
  [key: string]: string | string[] | undefined;
}): FilterParams {
  const time = parseList(searchParams.time).filter((t): t is TimeOfDay =>
    VALID_TIMES.includes(t as TimeOfDay)
  );
  const age = parseList(searchParams.age);
  const zone = parseList(searchParams.zone);
  return { time, age, zone };
}

export function buildFilterQueryString(filters: FilterParams): string {
  const params = new URLSearchParams();
  if (filters.time.length > 0) params.set("time", filters.time.join(","));
  if (filters.age.length > 0) params.set("age", filters.age.join(","));
  if (filters.zone.length > 0) params.set("zone", filters.zone.join(","));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
