import Link from "next/link";
import { Sport } from "@/lib/sports";
import {
  addDays,
  formatDateLong,
  formatDayOfMonth,
  formatWeekdayShort,
  todayDateString,
} from "@/lib/format";

const STRIP_OFFSETS = [-2, -1, 0, 1, 2, 3, 4];

const ARROW_CLASSES =
  "flex h-12 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-900/10 bg-white text-slate-500 shadow-sm transition hover:border-emerald-500/50 hover:text-emerald-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-400/50 dark:hover:text-emerald-400";

export default function DateNav({
  sport,
  date,
  filterQueryString,
}: {
  sport: Sport;
  date: string;
  filterQueryString: string;
}) {
  const today = todayDateString();
  const base = `/programs/${sport.slug}`;

  return (
    <div className="mb-8">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        <Link
          href="/programs"
          className="hover:text-emerald-700 hover:underline dark:hover:text-emerald-400"
        >
          Programs
        </Link>
        <span className="mx-1.5 text-slate-300 dark:text-slate-600">/</span>
        {sport.emoji} {sport.name}
      </p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {sport.name} · {formatDateLong(date)}
        </h1>
        {date !== today && (
          <Link
            href={`${base}/${today}${filterQueryString}`}
            className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Jump to today →
          </Link>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Link
          href={`${base}/${addDays(date, -1)}${filterQueryString}`}
          aria-label="Previous day"
          className={ARROW_CLASSES}
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
                href={`${base}/${d}${filterQueryString}`}
                aria-current={isSelected ? "date" : undefined}
                className={`flex min-w-[3.5rem] flex-1 flex-col items-center rounded-lg border px-2 py-1.5 transition sm:min-w-[4rem] ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-600 text-white shadow"
                    : "border-slate-900/10 bg-white text-slate-600 shadow-sm hover:border-emerald-500/50 hover:text-emerald-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/50 dark:hover:text-emerald-400"
                }`}
              >
                <span
                  className={`text-[11px] font-medium uppercase tracking-wide ${
                    isSelected
                      ? "text-emerald-100"
                      : "text-slate-400 dark:text-slate-500"
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
          href={`${base}/${addDays(date, 1)}${filterQueryString}`}
          aria-label="Next day"
          className={ARROW_CLASSES}
        >
          →
        </Link>
      </div>
    </div>
  );
}
