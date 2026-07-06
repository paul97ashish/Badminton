import { BadmintonSession } from "@/lib/toronto-api";
import { formatAgeCompact, formatTimeRange } from "@/lib/format";

export default function ProgramCard({ session }: { session: BadmintonSession }) {
  return (
    <div className="group flex flex-col rounded-xl border border-slate-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-emerald-400/50">
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          {formatTimeRange(
            session.startHour,
            session.startMinute,
            session.endHour,
            session.endMinute
          )}
        </p>
        <span
          title={session.ageLabel}
          className="mt-0.5 whitespace-nowrap rounded-full bg-slate-900/5 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300"
        >
          {formatAgeCompact(session.ageMin, session.ageMax)}
        </span>
      </div>

      <div className="mt-3 flex-1">
        <a
          href={session.location.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View this community centre on toronto.ca"
          className="font-semibold leading-snug text-slate-800 transition hover:text-emerald-700 hover:underline dark:text-slate-200 dark:hover:text-emerald-400"
        >
          {session.location.name}
        </a>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-900/5 pt-3 text-sm dark:border-white/5">
        {session.location.address ? (
          <a
            href={session.location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 items-center gap-1 text-emerald-700 hover:underline dark:text-emerald-400"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 shrink-0 opacity-70"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate">{session.location.address}</span>
          </a>
        ) : (
          <span />
        )}
        <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">
          {session.location.district}
        </span>
      </div>
    </div>
  );
}
