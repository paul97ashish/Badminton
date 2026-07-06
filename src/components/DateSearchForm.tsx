"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { todayDateString } from "@/lib/format";

export default function DateSearchForm() {
  const router = useRouter();
  const [date, setDate] = useState(todayDateString());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/programs/badminton/${date}`);
      }}
      className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-900/10 sm:flex-row"
    >
      <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-2.5">
        <span className="text-sm font-medium text-slate-400">Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-transparent font-medium text-slate-900 outline-none"
        />
      </label>
      <button
        type="submit"
        className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        Find sessions
      </button>
    </form>
  );
}
