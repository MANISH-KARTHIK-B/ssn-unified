import React, { useEffect, useMemo, useState } from "react";
import { LifeBuoy, ChevronRight, Users } from "lucide-react";
import { api, HUB_URL } from "../lib/api";
import { useAuth } from "../lib/auth";
import TicketDetail from "../components/TicketDetail";

const STATUS_STYLE = {
  Open: "bg-ember-100 text-ember-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700"
};

function StudentFilter({ value, onChange }) {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    api.get("/api/faculty/students").then((res) => setStudents(res.data));
  }, []);
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
      <Users className="h-4 w-4 text-char-500" />
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-sm text-char-900 outline-none">
        <option value="">All students</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>{s.name} — {s.regNo}</option>
        ))}
      </select>
    </div>
  );
}

export default function FacultyTickets() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [studentFilter, setStudentFilter] = useState("");

  useEffect(() => {
    const params = studentFilter ? `?studentId=${studentFilter}` : "";
    api.get(`/api/faculty/helpdesk/tickets${params}`).then((res) => setTickets(res.data));
  }, [studentFilter]);

  const filtered = useMemo(
    () => tickets.filter((t) => statusFilter === "All" || t.status === statusFilter),
    [tickets, statusFilter]
  );

  if (selected) {
    return (
      <TicketDetail
        ticket={selected}
        onBack={() => setSelected(null)}
        onUpdate={(t) => { setSelected(t); setTickets((prev) => prev.map((x) => (x.id === t.id ? t : x))); }}
        replyUrl={`/api/faculty/helpdesk/tickets/${selected.id}/reply`}
        isFaculty
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ember-100 text-ember-600"><LifeBuoy className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold text-char-900">Helpdesk — Faculty</h1>
            <p className="text-xs text-char-500">{user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href={HUB_URL} className="text-xs text-char-500 hover:underline">← Hub</a>
          <button onClick={logout} className="text-xs text-char-500 hover:underline">Logout</button>
        </div>
      </div>

      <div className="my-5 flex flex-wrap items-center gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
          <option>All</option><option>Open</option><option>In Progress</option><option>Resolved</option>
        </select>
        <StudentFilter value={studentFilter} onChange={setStudentFilter} />
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <button key={t.id} onClick={() => setSelected(t)} className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-ember-400">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-char-500">{t.category}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[t.status]}`}>{t.status}</span>
                <span className="text-[11px] text-char-500">{t.studentId}</span>
              </div>
              <p className="text-sm font-medium text-char-900">{t.subject}</p>
              <p className="text-xs text-char-500">Raised on {t.createdAt}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-char-500" />
          </button>
        ))}
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-char-500">No tickets match these filters.</p>}
      </div>
    </div>
  );
}
