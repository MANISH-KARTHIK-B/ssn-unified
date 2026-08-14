import React, { useEffect, useMemo, useState } from "react";
import { UtensilsCrossed, Star, Users, TrendingUp } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const TODAY_NAME = new Date().toLocaleDateString("en-US", { weekday: "long" });

export default function Mess() {
  const { user } = useAuth();
  const [menu, setMenu] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [form, setForm] = useState({ day: "Monday", meal: "lunch", rating: 5, comment: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.get("/api/hub/mess").then((res) => setMenu(res.data));
    api.get("/api/hub/mess/feedback").then((res) => setFeedbackList(res.data)).catch(() => {});
  }, []);

  const todaysMenu = useMemo(() => menu.find((m) => m.day === TODAY_NAME), [menu]);

  const avgByDay = useMemo(() => {
    const map = {};
    feedbackList.forEach((f) => {
      if (!map[f.day]) map[f.day] = { total: 0, count: 0 };
      map[f.day].total += f.rating;
      map[f.day].count += 1;
    });
    return menu.map((m) => ({
      day: m.day,
      avg: map[m.day] ? Math.round((map[m.day].total / map[m.day].count) * 10) / 10 : 0,
      count: map[m.day]?.count || 0
    }));
  }, [feedbackList, menu]);

  async function submitFeedback(e) {
    e.preventDefault();
    const res = await api.post("/api/hub/mess/feedback", form);
    setFeedbackList((prev) => [{ ...res.data, studentName: user?.name || "You" }, ...prev]);
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

      {todaysMenu && (
        <div className="mb-6 rounded-2xl border border-pink-500/20 bg-pink-500/5 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-pink-400">Today · {todaysMenu.day}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Breakfast", todaysMenu.breakfast],
              ["Lunch", todaysMenu.lunch],
              ["Snacks", todaysMenu.snacks],
              ["Dinner", todaysMenu.dinner]
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-navy-500">{label}</p>
                <p className="mt-1 text-sm text-navy-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
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
                  <tr key={m.day} className={`border-b border-navy-800/60 last:border-0 ${m.day === TODAY_NAME ? "bg-pink-500/5" : ""}`}>
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

          <div className="rounded-2xl border border-navy-800 bg-navy-900 p-5">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
              <TrendingUp className="h-4 w-4 text-navy-400" /> Average ratings by day
            </p>
            <div className="flex items-end gap-3" style={{ height: 100 }}>
              {avgByDay.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-amber-500"
                      style={{ height: `${(d.avg / 5) * 100}%`, minHeight: d.avg > 0 ? 4 : 0 }}
                      title={`${d.avg || "No ratings"} (${d.count} ratings)`}
                    />
                  </div>
                  <span className="text-[10px] text-navy-500">{d.day.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-navy-800 bg-navy-900 p-5">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
              <Users className="h-4 w-4 text-navy-400" /> Recent feedback
            </p>
            <div className="space-y-3">
              {feedbackList.slice(0, 8).map((f) => (
                <div key={f.id} className="flex items-start gap-3 border-t border-navy-800 pt-3 first:border-0 first:pt-0">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-800 text-xs font-semibold text-navy-200">
                    {(f.studentName || "S").split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-navy-200">{f.studentName || "Student"} · {f.day} {f.meal}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`h-3 w-3 ${n <= f.rating ? "fill-amber-400 text-amber-400" : "text-navy-700"}`} />
                        ))}
                      </div>
                    </div>
                    {f.comment && <p className="mt-1 text-xs text-navy-400">{f.comment}</p>}
                  </div>
                </div>
              ))}
              {feedbackList.length === 0 && <p className="text-xs text-navy-500">No feedback yet — be the first to rate a meal.</p>}
            </div>
          </div>
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
