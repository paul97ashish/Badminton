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
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded-md border border-black/10 bg-white px-4 py-2.5 text-gray-900 sm:w-auto"
      />
      <button
        type="submit"
        className="rounded-md bg-emerald-600 px-6 py-2.5 font-medium text-white hover:bg-emerald-700"
      >
        Find badminton drop-in
      </button>
    </form>
  );
}
