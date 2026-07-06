export function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute.toString().padStart(2, "0");
  return `${displayHour}:${displayMinute} ${period}`;
}

export function formatTimeRange(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number
): string {
  const samePeriod =
    (startHour >= 12 && endHour >= 12) || (startHour < 12 && endHour < 12);
  if (samePeriod) {
    const start = formatTime(startHour, startMinute).replace(/ (AM|PM)$/, "");
    return `${start}–${formatTime(endHour, endMinute)}`;
  }
  return `${formatTime(startHour, startMinute)}–${formatTime(endHour, endMinute)}`;
}

export function formatAgeCompact(
  ageMin: number | null,
  ageMax: number | null
): string {
  if (ageMin !== null && ageMax !== null) return `Ages ${ageMin}–${ageMax}`;
  if (ageMin !== null) return `Ages ${ageMin}+`;
  if (ageMax !== null) return `Up to ${ageMax}`;
  return "All ages";
}

export function parseDateStringLocal(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateLong(date: string): string {
  return parseDateStringLocal(date).toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatWeekdayShort(date: string): string {
  return parseDateStringLocal(date).toLocaleDateString("en-CA", {
    weekday: "short",
  });
}

export function formatDayOfMonth(date: string): number {
  return parseDateStringLocal(date).getDate();
}

export function addDays(date: string, days: number): string {
  const d = parseDateStringLocal(date);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
