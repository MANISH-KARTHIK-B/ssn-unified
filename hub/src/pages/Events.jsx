import React, { useEffect, useMemo, useState } from "react";
import { CalendarRange, MapPin, Building2, Clock, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";

const CATEGORY_STYLE = {
  Technical: "bg-blue-500/15 text-blue-400",
  Cultural: "bg-pink-500/15 text-pink-400",
  Sports: "bg-green-500/15 text-green-400",
  Workshop: "bg-amber-500/15 text-amber-400"
};

function daysUntil(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

function DeadlineBadge({ deadline }) {
  const days = daysUntil(deadline);
  if (days < 0) return <span className="rounded-full bg-navy-800 px-2.5 py-1 text-xs font-medium text-navy-400">Registration closed</span>;
  if (days <= 3) return <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-400">Closes in {days} day{days === 1 ? "" : "s"}</span>;
  if (days <= 7) return <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-400">Closes in {days} days</span>;
  return <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-400">Open — closes {deadline}</span>;
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [college, setCollege] = useState("All");
  const [category, setCategory] = useState("All");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    api.get("/api/hub/events").then((res) => setEvents(res.data));
    api.get("/api/hub/events/registrations").then((res) => setRegistrations(res.data)).catch(() => {});
  }, []);

  const colleges = useMemo(() => ["All", ...new Set(events.map((e) => e.college))], [events]);
  const categories = useMemo(() => ["All", ...new Set(events.map((e) => e.category))], [events]);

  const filtered = useMemo(() => {
    return events
      .filter((e) => (college === "All" || e.college === college) && (category === "All" || e.category === category))
      .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  }, [events, college, category]);

  const isRegistered = (id) => registrations.some((r) => r.eventId === id);

  async function register(id) {
    setBusyId(id);
    try {
      const res = await api.post(`/api/hub/events/${id}/register`);
      setRegistrations((prev) => [...prev, res.data]);
    } catch {
      // already registered or not logged in — ignore for this demo
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
          <CalendarRange className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Event Catalog</h1>
          <p className="text-sm text-navy-400">Upcoming events at SSN and other colleges — register before the deadline</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select value={college} onChange={(e) => setCollege(e.target.value)} className="rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500">
          {colleges.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-navy-700 bg-navy-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-500">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => {
          const registered = isRegistered(e.id);
          const closed = daysUntil(e.registrationDeadline) < 0;
          return (
            <div key={e.id} className="flex flex-col rounded-2xl border border-navy-800 bg-navy-900 p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_STYLE[e.category] || "bg-navy-800 text-navy-300"}`}>{e.category}</span>
                <span className="rounded-full bg-navy-800 px-2.5 py-1 text-xs text-navy-300">{e.mode}</span>
              </div>
              <p className="font-display text-lg font-semibold text-white">{e.title}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-300">
                <Building2 className="h-3.5 w-3.5 shrink-0" /> {e.college} · {e.department}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-400">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> {e.venue}
              </p>
              <p className="mt-3 text-sm leading-snug text-navy-300">{e.description}</p>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-navy-400">
                <Clock className="h-3.5 w-3.5" /> Event date: <span className="font-medium text-navy-200">{e.eventDate}</span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <DeadlineBadge deadline={e.registrationDeadline} />
                {registered ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                    <CheckCircle2 className="h-4 w-4" /> Registered
                  </span>
                ) : (
                  <button
                    onClick={() => register(e.id)}
                    disabled={closed || busyId === e.id}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-navy-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {busyId === e.id ? "Registering…" : closed ? "Closed" : "Register"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {events.length === 0 && <p className="text-sm text-navy-500">Loading events…</p>}
      {events.length > 0 && filtered.length === 0 && <p className="text-sm text-navy-500">No events match these filters.</p>}
    </main>
  );
}
