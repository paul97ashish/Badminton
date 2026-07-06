import Link from "next/link";
import DateSearchForm from "@/components/DateSearchForm";
import { addDays, formatDateLong, todayDateString } from "@/lib/format";

const FEATURES = [
  {
    icon: "📅",
    title: "Fresh daily schedules",
    body: "Every drop-in badminton session across Toronto community centres, pulled straight from the City's open data.",
  },
  {
    icon: "🎯",
    title: "Filter what matters",
    body: "Narrow by time of day, age group, and city zone — your picks stay applied as you browse between days.",
  },
  {
    icon: "🗺️",
    title: "See venues on a map",
    body: "Flip to map view to find the closest gym, with session times right in the marker popup.",
  },
];

export default function Home() {
  const today = todayDateString();
  const tomorrow = addDays(today, 1);

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
            Find a badminton court.
            <br />
            <span className="text-emerald-300">Just drop in.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-emerald-100/80">
            Every drop-in badminton session at Toronto community centres — by
            date, zone, and age group. No registration digging required.
          </p>

          <div className="mx-auto mt-8 max-w-lg">
            <DateSearchForm />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <Link
              href={`/programs/badminton/${today}`}
              className="rounded-full bg-white/10 px-4 py-1.5 font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              Today · {formatDateLong(today)}
            </Link>
            <Link
              href={`/programs/badminton/${tomorrow}`}
              className="rounded-full bg-white/10 px-4 py-1.5 font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              Tomorrow
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-900/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-2xl" aria-hidden>
                {feature.icon}
              </span>
              <h2 className="mt-3 font-display font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
