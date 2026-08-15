import React, { useEffect, useMemo, useState } from "react";
import { CalendarClock, X, Check, MessageSquare } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import StudentPicker from "../components/StudentPicker";

const STATUS_STYLE = {
  Pending: "bg-amber-500/15 text-amber-400",
  Confirmed: "bg-blue-500/15 text-blue-400",
  Completed: "bg-green-500/15 text-green-400",
  Cancelled: "bg-navy-800 text-navy-400"
};

function parseSlot(slot) {
  const [day, time] = slot.split(" ");
  return { day, time };
}

function StudentBooking() {
  const [mentors, setMentors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    api.get("/api/hub/mentors").then((res) => setMentors(res.data));
    api.get("/api/hub/appointments").then((res) => setAppointments(res.data));
  }, []);

  const grid = useMemo(() => {
    if (!selectedMentor) return { days: [], times: [] };
    const parsed = selectedMentor.slots.map(parseSlot);
    const days = [...new Set(parsed.map((p) => p.day))];
    const times = [...new Set(parsed.map((p) => p.time))].sort();
    return { days, times };
  }, [selectedMentor]);

  async function book() {
    if (!selectedMentor || !selectedSlot) return;
    const res = await api.post("/api/hub/appointments", { mentorId: selectedMentor.id, slot: selectedSlot });
    setAppointments((prev) => [res.data, ...prev]);
    setSelectedSlot(null);
  }

  async function cancel(id) {
    const res = await api.post(`/api/hub/appointments/${id}/cancel`);
    setAppointments((prev) => prev.map((a) => (a.id === id ? res.data : a)));
  }

  return (
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
              <div className="mt-4 overflow-x-auto">
                <div className="inline-grid gap-2" style={{ gridTemplateColumns: `56px repeat(${grid.days.length}, 72px)` }}>
                  <div />
                  {grid.days.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-navy-400">{d}</div>
                  ))}
                  {grid.times.map((t) => (
                    <React.Fragment key={t}>
                      <div className="flex items-center text-xs text-navy-500">{t}</div>
                      {grid.days.map((d) => {
                        const slot = `${d} ${t}`;
                        const available = m.slots.includes(slot);
                        const isSelected = selectedSlot === slot;
                        return available ? (
                          <button
                            key={d}
                            onClick={() => setSelectedSlot(slot)}
                            className={`h-8 rounded-md border text-[11px] ${isSelected ? "border-amber-500 bg-amber-500/20 text-amber-300" : "border-navy-700 bg-navy-950 text-navy-300 hover:border-navy-500"}`}
                          >
                            {isSelected ? "Selected" : "Open"}
                          </button>
                        ) : (
                          <div key={d} className="h-8 rounded-md bg-navy-900/40" />
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <button onClick={book} disabled={!selectedSlot} className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-navy-950 disabled:opacity-40">
          Request appointment
        </button>
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-navy-300">Your appointments</p>
        <div className="space-y-3">
          {appointments.map((a) => {
            const mentor = mentors.find((m) => m.id === a.mentorId);
            return (
              <div key={a.id} className="rounded-xl border border-navy-800 bg-navy-900 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-navy-100">{mentor?.name || a.mentorId}</p>
                    <p className="text-xs text-navy-500">{a.slot}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[a.status] || "bg-navy-800 text-navy-300"}`}>{a.status}</span>
                    {a.status === "Pending" && (
                      <button onClick={() => cancel(a.id)} className="rounded-md border border-navy-700 p-1.5 text-navy-400 hover:border-red-500 hover:text-red-400">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {a.reply && (
                  <p className="mt-2 flex items-start gap-1.5 rounded-md bg-navy-950 p-2 text-xs text-navy-300">
                    <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-navy-500" /> {a.reply}
                  </p>
                )}
              </div>
            );
          })}
          {appointments.length === 0 && <p className="text-sm text-navy-500">No appointments yet.</p>}
        </div>
      </div>
    </div>
  );
}

function FacultyConsole() {
  const [appointments, setAppointments] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentFilter, setStudentFilter] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});

  useEffect(() => {
    api.get("/api/faculty/students").then((res) => setStudents(res.data));
  }, []);

  useEffect(() => {
    const params = studentFilter ? `?studentId=${studentFilter}` : "";
    api.get(`/api/faculty/appointments${params}`).then((res) => setAppointments(res.data));
  }, [studentFilter]);

  async function updateStatus(id, status) {
    const res = await api.post(`/api/faculty/appointments/${id}/status`, { status, reply: replyDrafts[id] });
    setAppointments((prev) => prev.map((a) => (a.id === id ? res.data : a)));
  }

  const studentName = (id) => students.find((s) => s.id === id)?.name || id;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-navy-300">Booking requests {studentFilter ? `— ${studentName(studentFilter)}` : "— all students"}</p>
        <StudentPicker value={studentFilter} onChange={setStudentFilter} includeAllOption />
      </div>

      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a.id} className="rounded-xl border border-navy-800 bg-navy-900 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{studentName(a.studentId)}</p>
                <p className="text-xs text-navy-500">Requested slot: {a.slot}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[a.status] || "bg-navy-800 text-navy-300"}`}>{a.status}</span>
            </div>

            <textarea
              value={replyDrafts[a.id] ?? a.reply ?? ""}
              onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [a.id]: e.target.value }))}
              placeholder="Optional reply to the student…"
              rows={2}
              className="mt-3 w-full rounded-md border border-navy-700 bg-navy-950 px-3 py-2 text-xs text-white placeholder:text-navy-600"
            />

            <div className="mt-3 flex gap-2">
              <button onClick={() => updateStatus(a.id, "Confirmed")} className="flex items-center gap-1.5 rounded-md bg-blue-500/15 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/25">
                <Check className="h-3.5 w-3.5" /> Confirm
              </button>
              <button onClick={() => updateStatus(a.id, "Completed")} className="rounded-md bg-green-500/15 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/25">
                Mark completed
              </button>
              <button onClick={() => updateStatus(a.id, "Cancelled")} className="flex items-center gap-1.5 rounded-md bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/25">
                <X className="h-3.5 w-3.5" /> Cancel
              </button>
            </div>
          </div>
        ))}
        {appointments.length === 0 && <p className="text-sm text-navy-500">No booking requests{studentFilter ? " for this student" : ""} yet.</p>}
      </div>
    </div>
  );
}

export default function Mentors() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
          <CalendarClock className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Mentor Appointment Booking</h1>
          {isFaculty && <p className="text-sm text-navy-400">Faculty mode — review, confirm, or cancel student booking requests</p>}
        </div>
      </div>

      {isFaculty ? <FacultyConsole /> : <StudentBooking />}
    </main>
  );
}
