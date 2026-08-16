import React, { useEffect, useState } from "react";
import { Mail, Plus, Clock, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";
import SectionHeader from "../components/SectionHeader";

const CATEGORIES = ["Academic", "Hostel", "Fee / Finance", "Facilities", "Harassment / Conduct", "Other"];

const STATUS_STYLE = {
  Submitted: "bg-amber-100 text-amber-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700"
};

export default function Grievance() {
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({ category: CATEGORIES[0], subject: "", description: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.get("/api/erp/grievances").then((res) => setGrievances(res.data));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.post("/api/erp/grievances", form);
      setGrievances((prev) => [res.data, ...prev]);
      setForm({ category: CATEGORIES[0], subject: "", description: "" });
      setSent(true);
      setTimeout(() => setSent(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <SectionHeader icon={Mail} title="Grievance" subtitle="Raise a formal grievance and track its resolution" />

      <form onSubmit={submit} className="mb-8 space-y-3 rounded-2xl border border-wine-100 bg-white p-5">
        <p className="mb-1 font-display text-sm font-bold text-stone-900">Submit a new grievance</p>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail…" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-wine-600 py-2.5 text-sm font-semibold text-white hover:bg-wine-700 disabled:opacity-60">
          <Plus className="h-4 w-4" /> {busy ? "Submitting…" : "Submit grievance"}
        </button>
        {sent && <p className="text-xs text-green-600">Grievance submitted — you can track its status below.</p>}
      </form>

      <div className="space-y-3">
        <p className="font-display text-sm font-bold text-stone-900">Your grievances</p>
        {grievances.map((g) => (
          <div key={g.id} className="rounded-2xl border border-wine-100 bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">{g.category}</span>
              <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[g.status]}`}>
                {g.status === "Resolved" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />} {g.status}
              </span>
            </div>
            <p className="font-medium text-stone-900">{g.subject}</p>
            <p className="mt-1 text-xs text-stone-500">Submitted {g.submittedOn}</p>
            <p className="mt-2 text-sm text-stone-600">{g.description}</p>
          </div>
        ))}
        {grievances.length === 0 && <p className="text-sm text-stone-500">No grievances submitted yet.</p>}
      </div>
    </main>
  );
}
