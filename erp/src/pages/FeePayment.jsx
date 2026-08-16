import React, { useEffect, useState } from "react";
import { IndianRupee } from "lucide-react";
import { api } from "../lib/api";
import SectionHeader from "../components/SectionHeader";

export default function FeePayment() {
  const [data, setData] = useState(null);
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    api.get("/api/erp/fees").then((res) => setData(res.data));
  }, []);

  async function payNow(semester) {
    setPaying(semester);
    const res = await api.post(`/api/erp/fees/${encodeURIComponent(semester)}/pay`);
    setData(res.data);
    setPaying(null);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <SectionHeader icon={IndianRupee} title="Fee Payment" subtitle="Semester fee structure and payment status" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data?.semesters.map((s) => (
          <div key={s.semester} className="rounded-2xl border border-wine-100 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display font-semibold text-stone-900">{s.semester}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {s.status}
              </span>
            </div>
            <p className="font-display text-2xl font-bold text-stone-900">₹{s.amount.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-xs text-stone-500">
              {s.status === "Paid" ? `Paid on ${s.paidOn}` : `Due by ${s.dueDate}`}
            </p>
            {s.status !== "Paid" && (
              <button
                onClick={() => payNow(s.semester)}
                disabled={paying === s.semester}
                className="mt-4 w-full rounded-lg bg-wine-600 py-2 text-sm font-semibold text-white hover:bg-wine-700 disabled:opacity-60"
              >
                {paying === s.semester ? "Processing…" : "Pay Now (mock)"}
              </button>
            )}
          </div>
        ))}
      </div>
      {!data && <p className="text-sm text-stone-500">Loading…</p>}
    </main>
  );
}
