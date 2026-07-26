import React, { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { api } from "../lib/api";

const STATUS_STYLE = {
  Pending: "bg-amber-500/15 text-amber-400",
  Confirmed: "bg-blue-500/15 text-blue-400",
  Completed: "bg-green-500/15 text-green-400"
};

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    api.get("/api/hub/mentors").then((res) => setMentors(res.data));
    api.get("/api/hub/appointments").then((res) => setAppointments(res.data));
  }, []);

  async function book() {
    if (!selectedMentor || !selectedSlot) return;
    const res = await api.post("/api/hub/appointments", { mentorId: selectedMentor.id, slot: selectedSlot });
    setAppointments((prev) => [res.data, ...prev]);
    setSelectedSlot(null);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
          <CalendarClock className="h-5 w-5" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-white">Mentor Appointment Booking</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-medium text-navy-300">Available mentors</p>
          {mentors.map((m) => (
            <div key={m.id} className={`rounded-xl border p-4 ${selectedMentor?.id === m.id ? "border-amber-500" : "border-navy-800"} bg-navy-900`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-navy-500">{m.department}</p>
                </div>
                <button
                  onClick={() => { setSelectedMentor(m); setSelectedSlot(null); }}
                  className="rounded-md border border-navy-700 px-3 py-1.5 text-xs text-navy-200 hover:border-amber-500"
                >
                  Select
                </button>
              </div>
              {selectedMentor?.id === m.id && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSlot(s)}
                      className={`rounded-full border px-3 py-1 text-xs ${selectedSlot === s ? "border-amber-500 bg-amber-500/15 text-amber-300" : "border-navy-700 text-navy-300"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={book}
            disabled={!selectedSlot}
            className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-navy-950 disabled:opacity-40"
          >
            Request appointment
          </button>
        </div>

        <div>
          <p className="mb-4 text-sm font-medium text-navy-300">Your appointments</p>
          <div className="space-y-3">
            {appointments.map((a) => {
              const mentor = mentors.find((m) => m.id === a.mentorId);
              return (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-navy-800 bg-navy-900 p-4">
                  <div>
                    <p className="text-sm text-navy-100">{mentor?.name || a.mentorId}</p>
                    <p className="text-xs text-navy-500">{a.slot}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[a.status] || "bg-navy-800 text-navy-300"}`}>
                    {a.status}
                  </span>
                </div>
              );
            })}
            {appointments.length === 0 && <p className="text-sm text-navy-500">No appointments yet.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
