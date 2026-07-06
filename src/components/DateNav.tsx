import Link from "next/link";
import {
  addDays,
  formatDateLong,
  formatDayOfMonth,
  formatWeekdayShort,
  todayDateString,
} from "@/lib/format";

const STRIP_OFFSETS = [-2, -1, 0, 1, 2, 3, 4];

export default function DateNav({
  date,
  filterQueryString,
}: {
  date: string;
  filterQueryString: string;
}) {
  const today = todayDateString();

  return (
    <div className="mb-8">
      <p className="text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-700 hover:underline">
          Programs
        </Link>
        <span className="mx-1.5 text-slate-300">/</span>
        Badminton
      </p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
          {formatDateLong(date)}
        </h1>
        {date !== today && (
          <Link
            href={`/programs/badminton/${today}${filterQueryString}`}
            className="text-sm font-semibold text-emerald-700 hover:underline"
          >
            Jump to today →
          </Link>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Link
          href={`/programs/badminton/${addDays(date, -1)}${filterQueryString}`}
          aria-label="Previous day"
          className="flex h-12 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-900/10 bg-white text-slate-500 shadow-sm transition hover:border-emerald-500/50 hover:text-emerald-700"
        >
          ←
        </Link>
        <div className="flex flex-1 gap-1.5 overflow-x-auto pb-1 sm:gap-2">
          {STRIP_OFFSETS.map((offset) => {
            const d = addDays(date, offset);
            const isSelected = offset === 0;
            const isToday = d === today;
            return (
              <Link
                key={d}
                href={`/programs/badminton/${d}${filterQueryString}`}
                aria-current={isSelected ? "date" : undefined}
                className={`flex min-w-[3.5rem] flex-1 flex-col items-center rounded-lg border px-2 py-1.5 transition sm:min-w-[4rem] ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-600 text-white shadow"
                    : "border-slate-900/10 bg-white text-slate-600 shadow-sm hover:border-emerald-500/50 hover:text-emerald-700"
                }`}
              >
                <span
                  className={`text-[11px] font-medium uppercase tracking-wide ${
                    isSelected ? "text-emerald-100" : "text-slate-400"
                  }`}
                >
                  {isToday ? "Today" : formatWeekdayShort(d)}
                </span>
                <span className="font-display text-base font-bold leading-tight">
                  {formatDayOfMonth(d)}
                </span>
              </Link>
            );
          })}
        </div>
        <Link
          href={`/programs/badminton/${addDays(date, 1)}${filterQueryString}`}
          aria-label="Next day"
          className="flex h-12 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-900/10 bg-white text-slate-500 shadow-sm transition hover:border-emerald-500/50 hover:text-emerald-700"
        >
          →
        </Link>
      </div>
    </div>
  );
}
