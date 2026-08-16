import React, { useEffect, useState } from "react";
import { Landmark, Plus } from "lucide-react";
import { api } from "../lib/api";
import SectionHeader from "../components/SectionHeader";

const DOC_TYPES = ["Bonafide Certificate", "Transcript Request", "Fee Structure Certificate", "No Objection Certificate"];
const STEPS = ["Requested", "Under Review", "Ready for Collection"];

export default function Academic() {
  const [docs, setDocs] = useState([]);
  const [type, setType] = useState(DOC_TYPES[0]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/api/erp/documents").then((res) => setDocs(res.data));
  }, []);

  async function request() {
    setBusy(true);
    try {
      const res = await api.post("/api/erp/documents", { type });
      setDocs((prev) => [res.data, ...prev]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <SectionHeader icon={Landmark} title="Academic" subtitle="Request official academic documents and track their status" />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-wine-100 bg-white p-4">
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
          {DOC_TYPES.map((d) => <option key={d}>{d}</option>)}
        </select>
        <button onClick={request} disabled={busy} className="flex items-center gap-2 rounded-lg bg-wine-600 px-4 py-2 text-sm font-semibold text-white hover:bg-wine-700 disabled:opacity-60">
          <Plus className="h-4 w-4" /> {busy ? "Requesting…" : "Request document"}
        </button>
      </div>

      <div className="space-y-4">
        {docs.map((d) => {
          const stepIndex = STEPS.indexOf(d.status) === -1 ? 0 : STEPS.indexOf(d.status);
          return (
            <div key={d.id} className="rounded-2xl border border-wine-100 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium text-stone-900">{d.type}</p>
                <span className="text-xs text-stone-500">Requested {d.requestedOn}</span>
              </div>
              <div className="flex items-center">
                {STEPS.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center">
                      <div className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${i <= stepIndex ? "bg-wine-600 text-white" : "bg-gray-200 text-gray-500"}`}>{i + 1}</div>
                      <p className="mt-1 w-20 text-center text-[10px] text-stone-500">{s}</p>
                    </div>
                    {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < stepIndex ? "bg-wine-600" : "bg-gray-200"}`} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
        {docs.length === 0 && <p className="text-sm text-stone-500">No document requests yet.</p>}
      </div>
    </main>
  );
}
