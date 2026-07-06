import type { Metadata } from "next";
import Link from "next/link";
import { SPORTS } from "@/lib/sports";
import { getSportCounts } from "@/lib/toronto-api";
import { formatDateLong, todayDateString } from "@/lib/format";

export const metadata: Metadata = {
  title: "All Drop-in Programs | Toronto Community Centres",
  description:
    "Browse every drop-in sport and activity at Toronto community centres — badminton, basketball, swimming, pickleball, skating, fitness and more.",
};

export default async function ProgramsIndexPage() {
  const today = todayDateString();
  const counts = await getSportCounts(today);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        All programs
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Session counts for today, {formatDateLong(today)}.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SPORTS.map((sport) => {
          const count = counts.get(sport.slug) ?? 0;
          return (
            <Link
              key={sport.slug}
              href={`/programs/${sport.slug}/${today}`}
              className="group flex items-center gap-3 rounded-xl border border-slate-900/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-emerald-400/50"
            >
              <span className="text-2xl" aria-hidden>
                {sport.emoji}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                  {sport.name}
                </span>
                <span className="block text-xs text-slate-400 dark:text-slate-500">
                  {count} today
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
