import React, { useEffect, useState } from "react";
import { UtensilsCrossed, Star } from "lucide-react";
import { api } from "../lib/api";

export default function Mess() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ day: "Monday", meal: "lunch", rating: 5, comment: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.get("/api/hub/mess").then((res) => setMenu(res.data));
  }, []);

  async function submitFeedback(e) {
    e.preventDefault();
    await api.post("/api/hub/mess/feedback", form);
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-500/15 text-pink-400">
          <UtensilsCrossed className="h-5 w-5" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-white">Mess</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-2xl border border-navy-800 bg-navy-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-800 text-left text-xs uppercase tracking-wide text-navy-500">
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Breakfast</th>
                <th className="px-4 py-3">Lunch</th>
                <th className="px-4 py-3">Snacks</th>
                <th className="px-4 py-3">Dinner</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((m) => (
                <tr key={m.day} className="border-b border-navy-800/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-navy-100">{m.day}</td>
                  <td className="px-4 py-3 text-navy-400">{m.breakfast}</td>
                  <td className="px-4 py-3 text-navy-400">{m.lunch}</td>
                  <td className="px-4 py-3 text-navy-400">{m.snacks}</td>
                  <td className="px-4 py-3 text-navy-400">{m.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {menu.length === 0 && <p className="p-6 text-sm text-navy-500">Loading menu…</p>}
        </div>

        <form onSubmit={submitFeedback} className="h-fit space-y-3 rounded-2xl border border-navy-800 bg-navy-900 p-5">
          <p className="text-sm font-medium text-white">Rate a meal</p>
          <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full rounded-md border border-navy-700 bg-navy-950 px-3 py-2 text-sm text-white">
            {menu.map((m) => <option key={m.day}>{m.day}</option>)}
          </select>
          <select value={form.meal} onChange={(e) => setForm({ ...form, meal: e.target.value })} className="w-full rounded-md border border-navy-700 bg-navy-950 px-3 py-2 text-sm text-white">
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="snacks">Snacks</option>
            <option value="dinner">Dinner</option>
          </select>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })}>
                <Star className={`h-5 w-5 ${n <= form.rating ? "fill-amber-400 text-amber-400" : "text-navy-700"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Any comments?"
            rows={3}
            className="w-full rounded-md border border-navy-700 bg-navy-950 px-3 py-2 text-sm text-white placeholder:text-navy-600"
          />
          <button className="w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-navy-950 hover:bg-amber-400">
            Submit feedback
          </button>
          {sent && <p className="text-xs text-green-400">Thanks — your feedback was recorded.</p>}
        </form>
      </div>
    </main>
  );
}
