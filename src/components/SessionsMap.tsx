"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BadmintonSession } from "@/lib/toronto-api";
import { formatTimeRange } from "@/lib/format";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const TORONTO_CENTER: [number, number] = [43.6532, -79.3832];

export default function SessionsMap({
  sessions,
}: {
  sessions: BadmintonSession[];
}) {
  const byLocation = new Map<number, BadmintonSession[]>();
  for (const session of sessions) {
    if (session.location.lat === null || session.location.lng === null) continue;
    const list = byLocation.get(session.location.id) ?? [];
    list.push(session);
    byLocation.set(session.location.id, list);
  }

  if (byLocation.size === 0) {
    return (
      <p className="text-slate-500">
        No mappable locations for the current filters.
      </p>
    );
  }

  return (
    <div className="isolate overflow-hidden rounded-xl border border-slate-900/10 shadow-sm">
      <MapContainer
        center={TORONTO_CENTER}
        zoom={11}
        scrollWheelZoom
        style={{ height: "600px", width: "100%" }}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Array.from(byLocation.entries()).map(([locationId, group]) => {
        const { lat, lng, name, district } = group[0].location;
        return (
          <Marker key={locationId} position={[lat as number, lng as number]} icon={markerIcon}>
            <Popup>
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-gray-600">{district}</p>
              <ul className="mt-1 space-y-0.5 text-sm">
                {group.map((session) => (
                  <li key={session.id}>
                    {formatTimeRange(
                      session.startHour,
                      session.startMinute,
                      session.endHour,
                      session.endMinute
                    )}{" "}
                    · {session.ageLabel}
                  </li>
                ))}
              </ul>
            </Popup>
          </Marker>
        );
      })}
      </MapContainer>
    </div>
  );
}
