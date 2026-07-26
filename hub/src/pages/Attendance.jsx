import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ClipboardCheck } from "lucide-react";
import { api, API_URL_BASE } from "../lib/api";
import { useAuth } from "../lib/auth";

const THRESHOLD = 75;

function pctColor(pct) {
  if (pct >= 85) return "text-green-400 bg-green-500/10";
  if (pct >= THRESHOLD) return "text-amber-400 bg-amber-500/10";
  return "text-red-400 bg-red-500/10";
}

function WhatIf({ subject }) {
  const [extraClasses, setExtraClasses] = useState(0);
  const [attendAll, setAttendAll] = useState(true);
  if (!subject) return null;
  const held = subject.held + extraClasses;
  const attended = subject.attended + (attendAll ? extraClasses : 0);
  const projected = held ? Math.round((attended / held) * 1000) / 10 : 0;
  return (
    <div className="rounded-xl border border-navy-800 bg-navy-900 p-4">
      <p className="mb-3 text-sm font-medium text-white">What-if calculator — {subject.subject}</p>
      <div className="mb-3 flex items-center gap-3">
        <label className="text-xs text-navy-400">Additional classes</label>
        <input
          type="number"
          min={0}
          value={extraClasses}
          onChange={(e) => setExtraClasses(Math.max(0, Number(e.target.value)))}
          className="w-20 rounded-md border border-navy-700 bg-navy-950 px-2 py-1 text-sm text-white"
        />
        <label className="flex items-center gap-1.5 text-xs text-navy-400">
          <input type="checkbox" checked={attendAll} onChange={(e) => setAttendAll(e.target.checked)} />
          I attend all of them
        </label>
      </div>
      <p className="text-sm text-navy-300">
        Projected attendance: <span className={`rounded px-1.5 py-0.5 font-semibold ${pctColor(projected)}`}>{projected}%</span>
      </p>
    </div>
  );
}

export default function Attendance() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mentorMode, setMentorMode] = useState(false);

  useEffect(() => {
    api.get("/api/hub/attendance").then((res) => {
      setRows(res.data);
      setSelected(res.data[0] || null);
    });
    const socket = io(`${API_URL_BASE}/attendance`);
    socket.on("attendance:update", (rec) => {
      setRows((prev) => prev.map((r) => (r.id === rec.id ? rec : r)));
    });
    return () => socket.disconnect();
  }, []);

  async function markAttendance(id, present) {
    const res = await api.post("/api/hub/attendance/mark", { subjectId: id, present });
    setRows((prev) => prev.map((r) => (r.id === id ? res.data : r)));
  }

  const overall = rows.length
    ? Math.round((rows.reduce((s, r) => s + r.attended, 0) / rows.reduce((s, r) => s + r.held, 0)) * 1000) / 10
    : 0;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-500/15 text-green-400">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-white">Attendance Monitor</h1>
            <p className="text-sm text-navy-400">Overall: <span className={`rounded px-1.5 py-0.5 font-semibold ${pctColor(overall)}`}>{overall}%</span></p>
          </div>
        </div>
        {(user?.role === "teacher" || user?.role === "mentor") && (
          <button
            onClick={() => setMentorMode((m) => !m)}
            className="rounded-lg border border-navy-700 bg-navy-900 px-4 py-2 text-sm text-navy-200 hover:border-amber-500"
          >
            {mentorMode ? "Exit mentor view" : "Mark attendance (mentor)"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl border border-navy-800 bg-navy-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-800 text-left text-xs uppercase tracking-wide text-navy-500">
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Held</th>
                <th className="px-4 py-3">Attended</th>
                <th className="px-4 py-3">%</th>
                {mentorMode && <th className="px-4 py-3">Mark today</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`cursor-pointer border-b border-navy-800/60 last:border-0 hover:bg-navy-800/40 ${selected?.id === r.id ? "bg-navy-800/60" : ""}`}
                >
                  <td className="px-4 py-3 text-navy-100">{r.subject}</td>
                  <td className="px-4 py-3 text-navy-400">{r.held}</td>
                  <td className="px-4 py-3 text-navy-400">{r.attended}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-1.5 py-0.5 font-semibold ${pctColor(r.percentage)}`}>{r.percentage}%</span>
                  </td>
                  {mentorMode && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => markAttendance(r.id, true)} className="rounded-md bg-green-500/15 px-2 py-1 text-xs text-green-400 hover:bg-green-500/25">Present</button>
                        <button onClick={() => markAttendance(r.id, false)} className="rounded-md bg-red-500/15 px-2 py-1 text-xs text-red-400 hover:bg-red-500/25">Absent</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="p-6 text-sm text-navy-500">Loading attendance…</p>}
        </div>

        <div className="space-y-6">
          <WhatIf subject={selected} />
          <div className="rounded-xl border border-navy-800 bg-navy-900 p-4">
            <p className="mb-3 text-sm font-medium text-white">Semester calendar heatmap</p>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 91 }).map((_, i) => {
                const intensity = Math.random();
                const color =
                  intensity > 0.7 ? "bg-green-500/70" : intensity > 0.4 ? "bg-amber-500/50" : "bg-navy-800";
                return <div key={i} className={`h-4 w-4 rounded-sm ${color}`} title={`Day ${i + 1}`} />;
              })}
            </div>
            <p className="mt-3 text-[11px] text-navy-500">Each cell approximates a day's attendance density for the semester.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
