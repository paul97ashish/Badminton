import Link from "next/link";
import DateSearchForm from "@/components/DateSearchForm";
import { addDays, formatDateLong, todayDateString } from "@/lib/format";

export default function Home() {
  const today = todayDateString();
  const tomorrow = addDays(today, 1);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Toronto Badminton Drop-in
      </h1>
      <p className="mt-3 text-lg text-gray-600">
        Search badminton drop-in programs across Toronto community centres,
        sourced from the City of Toronto&apos;s open data.
      </p>

      <div className="mt-8 flex justify-center">
        <DateSearchForm />
      </div>

      <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
        <Link
          href={`/programs/badminton/${today}`}
          className="text-emerald-700 hover:underline"
        >
          Today · {formatDateLong(today)}
        </Link>
        <Link
          href={`/programs/badminton/${tomorrow}`}
          className="text-emerald-700 hover:underline"
        >
          Tomorrow · {formatDateLong(tomorrow)}
        </Link>
      </div>
    </div>
  );
}
