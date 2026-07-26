import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function CatMarks() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/api/coe/cat-marks").then((res) => setData(res.data));
  }, []);

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">CAT Marks</h1>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">CAT 1</th>
              <th className="px-6 py-3">CAT 2</th>
              <th className="px-6 py-3">Max</th>
            </tr>
          </thead>
          <tbody>
            {data?.subjects.map((s) => (
              <tr key={s.subject} className="border-b border-slate-50 last:border-0">
                <td className="px-6 py-4 font-medium text-slate-800">{s.subject}</td>
                <td className="px-6 py-4 text-slate-600">{s.cat1}</td>
                <td className="px-6 py-4 text-slate-600">{s.cat2}</td>
                <td className="px-6 py-4 text-slate-500">{s.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data && <p className="p-6 text-sm text-slate-500">Loading…</p>}
      </div>
    </div>
  );
}
