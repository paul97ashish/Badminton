import { notFound } from "next/navigation";
import { getBadmintonSessions } from "@/lib/toronto-api";
import { buildFilterQueryString, parseFilterParams } from "@/lib/filter-params";
import DateNav from "@/components/DateNav";
import FilterableSessionList from "@/components/FilterableSessionList";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default async function BadmintonProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { date } = await params;

  if (!DATE_PATTERN.test(date)) {
    notFound();
  }

  const sessions = await getBadmintonSessions(date);
  const initialFilters = parseFilterParams(await searchParams);
  const filterQueryString = buildFilterQueryString(initialFilters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <DateNav date={date} filterQueryString={filterQueryString} />
      {sessions.length === 0 ? (
        <p className="text-gray-500">
          No badminton drop-in sessions found for this date across Toronto
          community centres.
        </p>
      ) : (
        <FilterableSessionList sessions={sessions} initialFilters={initialFilters} />
      )}
    </div>
  );
}
