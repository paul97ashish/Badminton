import { BadmintonSession } from "@/lib/toronto-api";
import { formatTimeRange } from "@/lib/format";

export default function ProgramCard({ session }: { session: BadmintonSession }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">Badminton</h3>
          <p className="text-sm text-gray-500">{session.ageLabel}</p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          {formatTimeRange(
            session.startHour,
            session.startMinute,
            session.endHour,
            session.endMinute
          )}
        </span>
      </div>
      <div className="mt-3 border-t border-black/5 pt-3">
        <p className="font-medium text-gray-800">{session.location.name}</p>
        <p className="text-sm text-gray-500">{session.location.district}</p>
        {session.location.address && (
          <a
            href={session.location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm text-emerald-700 hover:underline"
          >
            {session.location.address}
          </a>
        )}
      </div>
    </div>
  );
}
