import { notFound } from "next/navigation";
import { getBadmintonSessions } from "@/lib/toronto-api";
import DateNav from "@/components/DateNav";
import FilterableSessionList from "@/components/FilterableSessionList";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default async function BadmintonProgramsPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (!DATE_PATTERN.test(date)) {
    notFound();
  }

  const sessions = await getBadmintonSessions(date);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <DateNav date={date} />
      {sessions.length === 0 ? (
        <p className="text-gray-500">
          No badminton drop-in sessions found for this date across Toronto
          community centres.
        </p>
      ) : (
        <FilterableSessionList sessions={sessions} />
      )}
    </div>
  );
}
