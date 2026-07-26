import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function ExamTimetable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/api/coe/timetable").then((res) => setRows(res.data));
  }, []);

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Exam Timetable & Seating</h1>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Hall</th>
              <th className="px-6 py-3">Seat No.</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.subject} className="border-b border-slate-50 last:border-0">
                <td className="px-6 py-4 text-slate-600">{r.date}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{r.subject}</td>
                <td className="px-6 py-4 text-slate-600">{r.time}</td>
                <td className="px-6 py-4 text-slate-600">{r.hall}</td>
                <td className="px-6 py-4 text-slate-600">{r.seat}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-sm text-slate-500">Loading…</p>}
      </div>
    </div>
  );
}
