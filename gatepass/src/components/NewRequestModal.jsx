import React, { useState } from "react";
import { X } from "lucide-react";
import { api } from "../lib/api";

export default function NewRequestModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ type: "Weekend Pass", departure: "", return: "", reason: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.post("/api/gatepass", form);
      onCreated(res.data);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg font-bold text-ink-900">New Pass Request</p>
          <button onClick={onClose}><X className="h-5 w-5 text-ink-500" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">Pass type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option>Weekend Pass</option>
              <option>Holiday Pass</option>
              <option>Working Day Pass</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">Departure date & time</label>
            <input required type="datetime-local" value={form.departure} onChange={(e) => setForm({ ...form, departure: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">Return date & time</label>
            <input required type="datetime-local" value={form.return} onChange={(e) => setForm({ ...form, return: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">Reason</label>
            <textarea rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <button disabled={busy} className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
            {busy ? "Submitting…" : "Submit request"}
          </button>
        </form>
      </div>
    </div>
  );
}
