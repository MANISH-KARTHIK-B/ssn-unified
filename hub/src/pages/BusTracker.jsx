import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import { Bus, Radio } from "lucide-react";
import { API_URL_BASE } from "../lib/api";

// A distinct color per route, cycling if more routes are added later.
const ROUTE_PALETTE = ["#3B82F6", "#10B981", "#A855F7", "#F43F5E", "#F59E0B", "#22D3EE"];

function hexToRgbSpace(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function createBusIcon(color) {
  const rgb = hexToRgbSpace(color);
  return new L.DivIcon({
    html: `<div class="bus-marker" style="--pulse-rgb:${rgb};background:${color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#08122B;font-weight:800;font-size:12px;border:2px solid rgba(255,255,255,0.85);">B</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function etaStyle(mins) {
  if (mins <= 5) return "bg-red-500/15 text-red-400";
  if (mins <= 15) return "bg-amber-500/15 text-amber-400";
  return "bg-green-500/15 text-green-400";
}

// Lives inside <MapContainer> so it can access the Leaflet map instance via useMap()
// and fly the view to whichever bus was last clicked in the sidebar.
function FlyToController({ requestId, positionsRef }) {
  const map = useMap();
  useEffect(() => {
    if (!requestId) return;
    const pos = positionsRef.current[requestId.routeId];
    if (pos) map.flyTo([pos.lat, pos.lng], 14, { duration: 1.1 });
  }, [requestId]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="animate-pulse rounded-2xl border border-navy-800 bg-navy-900" style={{ height: 480 }} />
      <div className="space-y-3">
        <div className="h-10 animate-pulse rounded-lg bg-navy-900" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl border border-navy-800 bg-navy-900" />
        ))}
      </div>
    </div>
  );
}

export default function BusTracker() {
  const [routes, setRoutes] = useState([]);
  const [positions, setPositions] = useState({});
  const [myRoute, setMyRoute] = useState("all");
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [flyRequest, setFlyRequest] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [nowTick, setNowTick] = useState(Date.now());

  const positionsRef = useRef({});
  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    const socket = io(`${API_URL_BASE}/bus`);
    socket.on("bus:routes", (r) => setRoutes(r));
    socket.on("bus:positions", (list) => {
      const map = {};
      list.forEach((p) => (map[p.routeId] = p));
      setPositions(map);
      setLastUpdate(Date.now());
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const colorFor = (routeId) => {
    const idx = routes.findIndex((r) => r.id === routeId);
    return ROUTE_PALETTE[idx % ROUTE_PALETTE.length] || ROUTE_PALETTE[0];
  };

  const visibleRoutes = useMemo(
    () => (myRoute === "all" ? routes : routes.filter((r) => r.id === myRoute)),
    [routes, myRoute]
  );

  const center = routes.length ? routes[0].path[Math.floor(routes[0].path.length / 2)] : [12.9, 80.18];
  const secondsAgo = lastUpdate ? Math.max(0, Math.floor((nowTick - lastUpdate) / 1000)) : null;

  function focusRoute(routeId) {
    setSelectedRouteId(routeId);
    setFlyRequest({ routeId, id: Date.now() });
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
            <Bus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-white">Bus Tracker</h1>
            <p className="text-sm text-navy-400">Live positions are simulated over Socket.io for this demo</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-navy-800 bg-navy-900 px-3 py-1.5 text-xs text-navy-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <Radio className="h-3.5 w-3.5" />
          {secondsAgo === null ? "Connecting…" : `Updated ${secondsAgo}s ago`}
        </div>
      </div>

      {routes.length === 0 ? (
        <Skeleton />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setMyRoute("all")}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                myRoute === "all" ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-navy-800 text-navy-300 hover:border-navy-600"
              }`}
            >
              All routes
            </button>
            {routes.map((r) => (
              <button
                key={r.id}
                onClick={() => setMyRoute(r.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  myRoute === r.id ? "border-amber-500 bg-amber-500/10 text-white" : "border-navy-800 text-navy-300 hover:border-navy-600"
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorFor(r.id) }} />
                {r.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-2xl border border-navy-800" style={{ height: 480 }}>
              <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
                <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FlyToController requestId={flyRequest} positionsRef={positionsRef} />
                {visibleRoutes.map((r) => (
                  <Polyline key={r.id} positions={r.path} pathOptions={{ color: colorFor(r.id), weight: 3, opacity: 0.55, dashArray: "4 8" }} />
                ))}
                {visibleRoutes.map((r) => {
                  const pos = positions[r.id];
                  if (!pos) return null;
                  return (
                    <Marker key={r.id} position={[pos.lat, pos.lng]} icon={createBusIcon(colorFor(r.id))} eventHandlers={{ click: () => setSelectedRouteId(r.id) }}>
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
            </div>

            <div className="space-y-3">
              {routes.map((r) => {
                const pos = positions[r.id];
                const color = colorFor(r.id);
                const isSelected = selectedRouteId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => focusRoute(r.id)}
                    className={`w-full rounded-xl border bg-navy-900 p-4 text-left transition hover:border-navy-600 ${isSelected ? "border-amber-500" : "border-navy-800"}`}
                    style={{ borderLeftColor: color, borderLeftWidth: 4 }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-2 text-sm font-medium text-white">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        {r.name}
                      </p>
                      <span className="text-xs text-navy-500">{r.driver}</span>
                    </div>
                    <p className="mt-1 text-xs text-navy-500">{r.stops.join(" → ")}</p>

                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-navy-800">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${Math.round((pos?.progress || 0) * 100)}%`, backgroundColor: color }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-navy-400">Next: {pos?.nextStop || "—"}</span>
                      <span className={`rounded-full px-2 py-0.5 font-medium ${pos ? etaStyle(pos.etaMinutes) : "bg-navy-800 text-navy-400"}`}>
                        ETA {pos ? `${pos.etaMinutes} min` : "…"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
