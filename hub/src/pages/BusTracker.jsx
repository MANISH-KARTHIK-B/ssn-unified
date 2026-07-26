import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import { Bus } from "lucide-react";
import { API_URL_BASE } from "../lib/api";

const busIcon = new L.DivIcon({
  html: `<div style="background:#F2A340;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 4px rgba(242,163,64,0.25);color:#0B1E3F;font-weight:700;font-size:12px;">B</div>`,
  className: "",
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

export default function BusTracker() {
  const [routes, setRoutes] = useState([]);
  const [positions, setPositions] = useState({});
  const [myRoute, setMyRoute] = useState("all");

  useEffect(() => {
    const socket = io(`${API_URL_BASE}/bus`);
    socket.on("bus:routes", (r) => setRoutes(r));
    socket.on("bus:positions", (list) => {
      const map = {};
      list.forEach((p) => (map[p.routeId] = p));
      setPositions(map);
    });
    return () => socket.disconnect();
  }, []);

  const visibleRoutes = useMemo(
    () => (myRoute === "all" ? routes : routes.filter((r) => r.id === myRoute)),
    [routes, myRoute]
  );

  const center = routes.length ? routes[0].path[Math.floor(routes[0].path.length / 2)] : [12.9, 80.18];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
          <Bus className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Bus Tracker</h1>
          <p className="text-sm text-navy-400">Live positions are simulated over Socket.io for this demo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-navy-800" style={{ height: 480 }}>
          {routes.length > 0 && (
            <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {visibleRoutes.map((r) => (
                <Polyline key={r.id} positions={r.path} pathOptions={{ color: "#2A4A82", weight: 3, dashArray: "4 6" }} />
              ))}
              {visibleRoutes.map((r) => {
                const pos = positions[r.id];
                if (!pos) return null;
                return (
                  <Marker key={r.id} position={[pos.lat, pos.lng]} icon={busIcon}>
                    <Popup>
                      <b>{r.name}</b>
                      <br />
                      Driver: {r.driver}
                      <br />
                      Next stop: {pos.nextStop}
                      <br />
                      ETA: {pos.etaMinutes} min
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>

        <div className="space-y-3">
          <select
            value={myRoute}
            onChange={(e) => setMyRoute(e.target.value)}
            className="w-full rounded-lg border border-navy-800 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          >
            <option value="all">All routes</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                My route: {r.name}
              </option>
            ))}
          </select>

          {routes.map((r) => {
            const pos = positions[r.id];
            return (
              <div key={r.id} className="rounded-xl border border-navy-800 bg-navy-900 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{r.name}</p>
                  <span className="text-xs text-navy-500">{r.driver}</span>
                </div>
                <p className="mt-1 text-xs text-navy-500">Stops: {r.stops.join(" → ")}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-navy-400">Next: {pos?.nextStop || "—"}</span>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-400">
                    ETA {pos ? `${pos.etaMinutes} min` : "…"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
