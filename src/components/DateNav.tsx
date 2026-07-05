import Link from "next/link";
import { addDays, formatDateLong, todayDateString } from "@/lib/format";

export default function DateNav({
  date,
  filterQueryString,
}: {
  date: string;
  filterQueryString: string;
}) {
  const prev = addDays(date, -1);
  const next = addDays(date, 1);
  const isToday = date === todayDateString();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:underline">
            Programs
          </Link>
          {" / "}
          <span>Badminton</span>
          {" / "}
          <span>{date}</span>
        </p>
        <h1 className="text-2xl font-bold text-gray-900">{formatDateLong(date)}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/programs/badminton/${prev}${filterQueryString}`}
          className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Previous day
        </Link>
        {!isToday && (
          <Link
            href={`/programs/badminton/${todayDateString()}${filterQueryString}`}
            className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Today
          </Link>
        )}
        <Link
          href={`/programs/badminton/${next}${filterQueryString}`}
          className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next day →
        </Link>
      </div>
    </div>
  );
}
