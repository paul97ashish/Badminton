"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BadmintonSession, TimeOfDay } from "@/lib/toronto-api";
import {
  buildFilterQueryString,
  FilterParams,
  ViewMode,
} from "@/lib/filter-params";
import ProgramCard from "./ProgramCard";

const SessionsMap = dynamic(() => import("./SessionsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full items-center justify-center rounded-xl border border-slate-900/10 bg-white text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
      Loading map…
    </div>
  ),
});

const TIME_OF_DAY_LABELS: Record<TimeOfDay, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

const TIME_OF_DAY_ICONS: Record<TimeOfDay, string> = {
  morning: "🌅",
  afternoon: "☀️",
  evening: "🌙",
};

const TIME_OF_DAY_ORDER: TimeOfDay[] = ["morning", "afternoon", "evening"];

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

function FilterOption({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-1.5 py-1 text-sm text-slate-600 transition hover:bg-slate-900/[0.03] dark:text-slate-300 dark:hover:bg-white/5">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-emerald-600"
        />
        {label}
      </span>
      <span className="text-xs tabular-nums text-slate-400 dark:text-slate-500">{count}</span>
    </label>
  );
}

export default function FilterableSessionList({
  sessions,
  initialFilters,
}: {
  sessions: BadmintonSession[];
  initialFilters: FilterParams;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const districts = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.location.district))).sort(),
    [sessions]
  );
  const ageLabels = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.ageLabel))).sort(),
    [sessions]
  );

  const [selectedDistricts, setSelectedDistricts] = useState<Set<string>>(
    () => new Set(initialFilters.zone)
  );
  const [selectedAges, setSelectedAges] = useState<Set<string>>(
    () => new Set(initialFilters.age)
  );
  const [selectedTimes, setSelectedTimes] = useState<Set<TimeOfDay>>(
    () => new Set(initialFilters.time)
  );
  const [view, setView] = useState<ViewMode>(initialFilters.view);

  function updateFilters(next: {
    time?: Set<TimeOfDay>;
    age?: Set<string>;
    zone?: Set<string>;
    view?: ViewMode;
  }) {
    const time = next.time ?? selectedTimes;
    const age = next.age ?? selectedAges;
    const zone = next.zone ?? selectedDistricts;
    const viewMode = next.view ?? view;

    if (next.time) setSelectedTimes(next.time);
    if (next.age) setSelectedAges(next.age);
    if (next.zone) setSelectedDistricts(next.zone);
    if (next.view) setView(next.view);

    const qs = buildFilterQueryString({
      time: Array.from(time),
      age: Array.from(age),
      zone: Array.from(zone),
      view: viewMode,
    });
    router.replace(`${pathname}${qs}`, { scroll: false });
  }

  const filtered = sessions.filter((s) => {
    if (selectedDistricts.size > 0 && !selectedDistricts.has(s.location.district))
      return false;
    if (selectedAges.size > 0 && !selectedAges.has(s.ageLabel)) return false;
    if (selectedTimes.size > 0 && !selectedTimes.has(s.timeOfDay)) return false;
    return true;
  });

  const grouped = TIME_OF_DAY_ORDER.map((tod) => ({
    tod,
    sessions: filtered.filter((s) => s.timeOfDay === tod),
  })).filter((g) => g.sessions.length > 0);

  const venueCount = new Set(filtered.map((s) => s.location.id)).size;
  const hasActiveFilters =
    selectedDistricts.size > 0 || selectedAges.size > 0 || selectedTimes.size > 0;

  const countBy = (predicate: (s: BadmintonSession) => boolean) =>
    sessions.filter(predicate).length;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
      <aside className="self-start rounded-xl border border-slate-900/10 bg-white p-5 shadow-sm md:sticky md:top-20 dark:border-white/10 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display font-bold text-slate-900 dark:text-white">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={() =>
                updateFilters({
                  time: new Set(),
                  age: new Set(),
                  zone: new Set(),
                })
              }
              className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Time of day
            </h3>
            {TIME_OF_DAY_ORDER.map((tod) => (
              <FilterOption
                key={tod}
                label={TIME_OF_DAY_LABELS[tod]}
                count={countBy((s) => s.timeOfDay === tod)}
                checked={selectedTimes.has(tod)}
                onChange={() =>
                  updateFilters({ time: toggle(selectedTimes, tod) })
                }
              />
            ))}
          </div>

          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Age group
            </h3>
            {ageLabels.map((age) => (
              <FilterOption
                key={age}
                label={age}
                count={countBy((s) => s.ageLabel === age)}
                checked={selectedAges.has(age)}
                onChange={() => updateFilters({ age: toggle(selectedAges, age) })}
              />
            ))}
          </div>

          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Zone
            </h3>
            {districts.map((district) => (
              <FilterOption
                key={district}
                label={district}
                count={countBy((s) => s.location.district === district)}
                checked={selectedDistricts.has(district)}
                onChange={() =>
                  updateFilters({ zone: toggle(selectedDistricts, district) })
                }
              />
            ))}
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">
              {filtered.length}
            </span>{" "}
            session{filtered.length === 1 ? "" : "s"} at{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{venueCount}</span>{" "}
            venue{venueCount === 1 ? "" : "s"}
          </p>
          <div className="inline-flex rounded-lg border border-slate-900/10 bg-white p-0.5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            {(["list", "map"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => updateFilters({ view: mode })}
                className={`rounded-md px-3.5 py-1 text-sm font-semibold capitalize transition ${
                  view === mode
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-900/15 bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-slate-900">
            <p className="text-3xl">🔍</p>
            <p className="mt-3 font-display font-semibold text-slate-900 dark:text-white">
              No sessions match your filters
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try clearing a filter or checking a nearby day.
            </p>
          </div>
        )}

        {filtered.length > 0 && view === "map" && (
          <SessionsMap sessions={filtered} />
        )}

        {filtered.length > 0 && view === "list" && (
          <div className="space-y-10">
            {grouped.map(({ tod, sessions: groupSessions }) => (
              <section key={tod}>
                <div className="mb-4 flex items-center gap-2.5">
                  <span aria-hidden className="text-lg">
                    {TIME_OF_DAY_ICONS[tod]}
                  </span>
                  <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {TIME_OF_DAY_LABELS[tod]}
                  </h2>
                  <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-500 dark:bg-white/10 dark:text-slate-400">
                    {groupSessions.length}
                  </span>
                  <div className="h-px flex-1 bg-slate-900/5 dark:bg-white/10" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {groupSessions.map((session) => (
                    <ProgramCard key={session.id} session={session} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
