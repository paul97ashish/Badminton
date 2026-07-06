import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSportSessions } from "@/lib/toronto-api";
import { getSport } from "@/lib/sports";
import { buildFilterQueryString, parseFilterParams } from "@/lib/filter-params";
import { formatDateLong } from "@/lib/format";
import DateNav from "@/components/DateNav";
import FilterableSessionList from "@/components/FilterableSessionList";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface PageParams {
  sport: string;
  date: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { sport: sportSlug, date } = await params;
  const sport = getSport(sportSlug);
  if (!sport || !DATE_PATTERN.test(date)) return {};
  return {
    title: `${sport.name} Drop-in · ${formatDateLong(date)} | Toronto Community Centres`,
    description: `Drop-in ${sport.name.toLowerCase()} sessions at Toronto community centres on ${formatDateLong(date)}, by zone and age group.`,
  };
}

export default async function SportProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { sport: sportSlug, date } = await params;
  const sport = getSport(sportSlug);

  if (!sport || !DATE_PATTERN.test(date)) {
    notFound();
  }

  const sessions = await getSportSessions(sport.slug, date);
  const initialFilters = parseFilterParams(await searchParams);
  const filterQueryString = buildFilterQueryString(initialFilters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <DateNav sport={sport} date={date} filterQueryString={filterQueryString} />
      {sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-900/15 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-slate-900">
          <p className="text-3xl">{sport.emoji}</p>
          <p className="mt-3 font-display font-semibold text-slate-900 dark:text-white">
            No {sport.name.toLowerCase()} sessions scheduled for this date
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Schedules are typically published a few weeks ahead — try a nearby
            day or another sport.
          </p>
        </div>
      ) : (
        <FilterableSessionList
          sessions={sessions}
          initialFilters={initialFilters}
          sportName={sport.name}
        />
      )}
    </div>
  );
}
