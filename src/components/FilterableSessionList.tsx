"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BadmintonSession, TimeOfDay } from "@/lib/toronto-api";
import { buildFilterQueryString, FilterParams } from "@/lib/filter-params";
import ProgramCard from "./ProgramCard";

const SessionsMap = dynamic(() => import("./SessionsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full items-center justify-center rounded-lg border border-black/10 bg-white text-gray-500">
      Loading map…
    </div>
  ),
});

type ViewMode = "list" | "map";

const TIME_OF_DAY_LABELS: Record<TimeOfDay, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
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
  const [view, setView] = useState<ViewMode>("list");

  function updateFilters(next: {
    time?: Set<TimeOfDay>;
    age?: Set<string>;
    zone?: Set<string>;
  }) {
    const time = next.time ?? selectedTimes;
    const age = next.age ?? selectedAges;
    const zone = next.zone ?? selectedDistricts;

    if (next.time) setSelectedTimes(next.time);
    if (next.age) setSelectedAges(next.age);
    if (next.zone) setSelectedDistricts(next.zone);

    const qs = buildFilterQueryString({
      time: Array.from(time),
      age: Array.from(age),
      zone: Array.from(zone),
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

  const hasActiveFilters =
    selectedDistricts.size > 0 || selectedAges.size > 0 || selectedTimes.size > 0;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
      <aside className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={() =>
                  updateFilters({
                    time: new Set(),
                    age: new Set(),
                    zone: new Set(),
                  })
                }
                className="text-sm text-emerald-700 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Time of day</h3>
          <div className="space-y-1">
            {TIME_OF_DAY_ORDER.map((tod) => (
              <label key={tod} className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedTimes.has(tod)}
                  onChange={() =>
                    updateFilters({ time: toggle(selectedTimes, tod) })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                />
                {TIME_OF_DAY_LABELS[tod]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Age group</h3>
          <div className="space-y-1">
            {ageLabels.map((age) => (
              <label key={age} className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedAges.has(age)}
                  onChange={() =>
                    updateFilters({ age: toggle(selectedAges, age) })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                />
                {age}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Zone</h3>
          <div className="space-y-1">
            {districts.map((district) => (
              <label key={district} className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedDistricts.has(district)}
                  onChange={() =>
                    updateFilters({ zone: toggle(selectedDistricts, district) })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                />
                {district}
              </label>
            ))}
          </div>
        </div>
      </aside>

      <div className="space-y-6">
        <div className="inline-flex rounded-md border border-black/10 bg-white p-1">
          <button
            onClick={() => setView("list")}
            className={`rounded px-3 py-1 text-sm font-medium ${
              view === "list"
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("map")}
            className={`rounded px-3 py-1 text-sm font-medium ${
              view === "map"
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Map
          </button>
        </div>

        {filtered.length === 0 && (
          <p className="text-gray-500">No badminton drop-in sessions match your filters.</p>
        )}

        {filtered.length > 0 && view === "map" && <SessionsMap sessions={filtered} />}

        {filtered.length > 0 && view === "list" && (
          <div className="space-y-8">
            {grouped.map(({ tod, sessions: groupSessions }) => (
              <section key={tod}>
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  {TIME_OF_DAY_LABELS[tod]}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
