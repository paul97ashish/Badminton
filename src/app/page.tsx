import Link from "next/link";
import DateSearchForm from "@/components/DateSearchForm";
import { SPORTS } from "@/lib/sports";
import { todayDateString } from "@/lib/format";

export default function Home() {
  const today = todayDateString();

  return (
    <>
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 text-white">
        <div className="mx-auto max-w-3xl px-4 pb-20 pt-16 text-center sm:pt-24">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-emerald-100 ring-1 ring-white/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            Live City of Toronto open data
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Pick a sport. Pick a day.
            <br />
            <span className="text-emerald-300">Just drop in.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-emerald-100/80">
            Every drop-in sport and activity at Toronto community centres —
            badminton, basketball, swimming, pickleball, skating and more.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <DateSearchForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Browse by sport
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SPORTS.map((sport) => (
            <Link
              key={sport.slug}
              href={`/programs/${sport.slug}/${today}`}
              className="group flex items-center gap-3 rounded-xl border border-slate-900/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-emerald-400/50"
            >
              <span className="text-2xl" aria-hidden>
                {sport.emoji}
              </span>
              <span className="truncate font-display font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                {sport.name}
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Filters for time of day, age group, and zone — plus a map view — are
          on every sport page, and your picks stay applied as you browse
          between days.
        </p>
      </section>
    </>
  );
}
