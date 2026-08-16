import React, { useEffect, useMemo, useState } from "react";
import { Plus, LifeBuoy, ChevronRight } from "lucide-react";
import { api, HUB_URL } from "../lib/api";
import { useAuth } from "../lib/auth";
import NewTicketModal from "../components/NewTicketModal";
import TicketDetail from "../components/TicketDetail";

const STATUS_STYLE = {
  Open: "bg-ember-100 text-ember-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700"
};

export default function Tickets() {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    api.get("/api/helpdesk/tickets").then((res) => setTickets(res.data));
  }, []);

  const categories = useMemo(() => ["All", ...new Set(tickets.map((t) => t.category))], [tickets]);
  const filtered = tickets.filter(
    (t) => (statusFilter === "All" || t.status === statusFilter) && (categoryFilter === "All" || t.category === categoryFilter)
  );

  if (selected) {
    return (
      <TicketDetail
        ticket={selected}
        onBack={() => setSelected(null)}
        onUpdate={(t) => { setSelected(t); setTickets((prev) => prev.map((x) => (x.id === t.id ? t : x))); }}
        replyUrl={`/api/helpdesk/tickets/${selected.id}/reply`}
        isFaculty={false}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ember-100 text-ember-600"><LifeBuoy className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold text-char-900">Helpdesk</h1>
            <p className="text-xs text-char-500">{user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href={HUB_URL} className="text-xs text-char-500 hover:underline">← Hub</a>
          <button onClick={logout} className="text-xs text-char-500 hover:underline">Logout</button>
        </div>
      </div>

      <div className="my-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
            <option>All</option><option>Open</option><option>In Progress</option><option>Resolved</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 rounded-lg bg-ember-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ember-600">
          <Plus className="h-4 w-4" /> Raise Ticket
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <button key={t.id} onClick={() => setSelected(t)} className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-ember-400">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-char-500">{t.category}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[t.status]}`}>{t.status}</span>
              </div>
              <p className="text-sm font-medium text-char-900">{t.subject}</p>
              <p className="text-xs text-char-500">Raised on {t.createdAt}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-char-500" />
          </button>
        ))}
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-char-500">No tickets match these filters.</p>}
      </div>

      {showNew && <NewTicketModal onClose={() => setShowNew(false)} onCreated={(t) => setTickets((prev) => [t, ...prev])} />}
    </div>
  );
}
