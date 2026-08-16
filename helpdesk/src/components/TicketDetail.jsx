import React, { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { api } from "../lib/api";

const STATUS_STYLE = {
  Open: "bg-ember-100 text-ember-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700"
};

export default function TicketDetail({ ticket, onBack, onUpdate, replyUrl, isFaculty }) {
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setBusy(true);
    try {
      const res = await api.post(replyUrl, { text: reply });
      onUpdate(res.data);
      setReply("");
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(status) {
    const res = await api.post(`/api/faculty/helpdesk/tickets/${ticket.id}/status`, { status });
    onUpdate(res.data);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-sm text-char-500 hover:text-ember-600">
        <ArrowLeft className="h-4 w-4" /> Back to tickets
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-char-500">{ticket.category}</span>
          {isFaculty ? (
            <select
              value={ticket.status}
              onChange={(e) => changeStatus(e.target.value)}
              className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[ticket.status]}`}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          ) : (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[ticket.status]}`}>{ticket.status}</span>
          )}
        </div>
        <p className="font-display text-lg font-bold text-char-900">{ticket.subject}</p>
        {isFaculty && <p className="mt-1 text-xs text-char-500">From {ticket.studentId}</p>}
        <p className="mt-1 text-xs text-char-500">Raised on {ticket.createdAt}</p>
        <p className="mt-3 text-sm leading-relaxed text-char-700">{ticket.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        {ticket.replies.map((r, i) => (
          <div key={i} className={`max-w-[80%] rounded-2xl p-4 text-sm ${r.from === "support" ? "bg-white border border-gray-200" : "ml-auto bg-ember-500 text-white"}`}>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide opacity-70">{r.from === "support" ? "Support team" : "Student"} · {r.at}</p>
            <p>{r.text}</p>
          </div>
        ))}
        {ticket.replies.length === 0 && <p className="text-sm text-char-500">No replies yet.</p>}
      </div>

      <form onSubmit={sendReply} className="mt-6 flex gap-2">
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a reply…"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
        />
        <button disabled={busy} className="flex items-center gap-1.5 rounded-lg bg-ember-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ember-600 disabled:opacity-60">
          <Send className="h-4 w-4" /> Send
        </button>
      </form>
    </div>
  );
}
