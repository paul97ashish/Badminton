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
        <div className="rounded-xl border border-dashed border-slate-900/15 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-slate-900">
          <p className="text-3xl">🏸</p>
          <p className="mt-3 font-display font-semibold text-slate-900 dark:text-white">
            No sessions scheduled for this date
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Schedules are typically published a few weeks ahead — try a nearby
            day.
          </p>
        </div>
      ) : (
        <FilterableSessionList sessions={sessions} initialFilters={initialFilters} />
      )}
    </div>
  );
}
