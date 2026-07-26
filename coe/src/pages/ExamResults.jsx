import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function ExamResults() {
  const [data, setData] = useState(null);
  const [semIndex, setSemIndex] = useState(0);

  useEffect(() => {
    api.get("/api/coe/results").then((res) => setData(res.data));
  }, []);

  const sem = data?.semesters?.[semIndex];

  return (
    <div className="px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">Exam Results</h1>
        {data && (
          <select
            value={semIndex}
            onChange={(e) => setSemIndex(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {data.semesters.map((s, i) => (
              <option key={s.semester} value={i}>{s.semester}</option>
            ))}
          </select>
        )}
      </div>

      {sem && (
        <>
          <div className="mb-4 flex gap-4">
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3">
              <p className="text-xs text-slate-500">SGPA</p>
              <p className="font-display text-2xl font-bold text-slate-900">{sem.sgpa}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3">
              <p className="text-xs text-slate-500">CGPA</p>
              <p className="font-display text-2xl font-bold text-slate-900">{data.cgpa}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Grade</th>
                </tr>
              </thead>
              <tbody>
                {sem.subjects.map((s) => (
                  <tr key={s.subject} className="border-b border-slate-50 last:border-0">
                    <td className="px-6 py-4 text-slate-800">{s.subject}</td>
                    <td className="px-6 py-4 font-semibold text-cobalt-600">{s.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {!data && <p className="text-sm text-slate-500">Loading…</p>}
    </div>
  );
}
