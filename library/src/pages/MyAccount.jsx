import React, { useEffect, useState } from "react";
import { ArrowLeft, BookMarked } from "lucide-react";
import { api, HUB_URL } from "../lib/api";
import { useAuth } from "../lib/auth";

const FINE_PER_DAY = 2;

function daysOverdue(dueOn) {
  const due = new Date(dueOn);
  const today = new Date();
  const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function MyAccount({ onBack }) {
  const { user } = useAuth();
  const [issued, setIssued] = useState([]);

  useEffect(() => {
    api.get("/api/library/issued").then((res) => setIssued(res.data));
  }, []);

  const totalFine = issued.reduce((sum, b) => sum + daysOverdue(b.dueOn) * FINE_PER_DAY, 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-ocean-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to catalog
        </button>
        <a href={HUB_URL} className="text-xs text-ocean-500 hover:underline">← SSN Unified hub</a>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-ocean-600/10 text-ocean-700">
          <BookMarked className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ocean-900">My Account</h1>
          <p className="text-sm text-ocean-600">{user?.name} · {user?.regNo}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ocean-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ocean-100 bg-ocean-50 text-left text-xs uppercase tracking-wide text-ocean-600">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Issued on</th>
              <th className="px-5 py-3">Due on</th>
              <th className="px-5 py-3">Overdue</th>
              <th className="px-5 py-3">Fine</th>
            </tr>
          </thead>
          <tbody>
            {issued.map((b) => {
              const overdue = daysOverdue(b.dueOn);
              return (
                <tr key={b.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5 font-medium text-ocean-900">{b.title}</td>
                  <td className="px-5 py-3.5 text-ocean-600">{b.issuedOn}</td>
                  <td className="px-5 py-3.5 text-ocean-600">{b.dueOn}</td>
                  <td className="px-5 py-3.5">
                    {overdue > 0 ? (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">{overdue} days</span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">On time</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-ocean-900">₹{overdue * FINE_PER_DAY}</td>
                </tr>
              );
            })}
            {issued.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-ocean-500">No books currently issued.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-ocean-100 bg-ocean-50 px-5 py-4">
        <p className="text-sm text-ocean-700">Total overdue fine (₹{FINE_PER_DAY}/day per book)</p>
        <p className="font-display text-xl font-bold text-ocean-900">₹{totalFine}</p>
      </div>
    </div>
  );
}
