import React, { useState } from "react";
import { Paperclip, X } from "lucide-react";
import { api } from "../lib/api";

const CATEGORIES = ["IT Services", "Academics", "Facilities", "Hostel", "Finance", "Other"];

export default function NewTicketModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ category: CATEGORIES[0], subject: "", description: "" });
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.post("/api/helpdesk/tickets", form);
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
          <p className="font-display text-lg font-bold text-char-900">Raise a Ticket</p>
          <button onClick={onClose}><X className="h-5 w-5 text-char-500" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-char-500">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-char-500">Subject</label>
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-char-500">Description</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-xs text-char-500 hover:border-ember-400">
            <Paperclip className="h-3.5 w-3.5" />
            {fileName || "Attach a file (optional, mock only)"}
            <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files[0]?.name || "")} />
          </label>
          <button disabled={busy} className="w-full rounded-lg bg-ember-500 py-2.5 text-sm font-semibold text-white hover:bg-ember-600 disabled:opacity-60">
            {busy ? "Submitting…" : "Submit ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
