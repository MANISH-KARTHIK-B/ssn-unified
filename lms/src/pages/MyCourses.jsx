import React, { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { api } from "../lib/api";
import CourseCard from "../components/CourseCard";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("name");
  const [view, setView] = useState("card");

  useEffect(() => {
    api.get("/api/lms/courses").then((res) => setCourses(res.data));
  }, []);

  const filtered = useMemo(() => {
    let list = courses.filter(
      (c) => !q || c.title.toLowerCase().includes(q.toLowerCase()) || c.code.toLowerCase().includes(q.toLowerCase())
    );
    if (sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "progress") list = [...list].sort((a, b) => b.progress - a.progress);
    return list;
  }, [courses, q, sort]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-graphite-900">My courses</h1>
      <p className="mt-1 text-sm text-graphite-500">Course overview</p>

      <div className="my-5 h-px bg-gray-200" />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
          <option>All</option>
        </select>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
          <option value="name">Sort by course name</option>
          <option value="progress">Sort by progress</option>
        </select>
        <div className="ml-auto flex overflow-hidden rounded-lg border border-gray-200">
          <button onClick={() => setView("card")} className={`px-3 py-2 ${view === "card" ? "bg-violet-100 text-violet-700" : "text-graphite-500"}`}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setView("list")} className={`px-3 py-2 ${view === "list" ? "bg-violet-100 text-violet-700" : "text-graphite-500"}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === "card" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {filtered.map((c) => (
            <a key={c.id} href={`#/course/${c.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-violet-700">{c.code} — {c.title}</p>
                <p className="text-xs text-graphite-500">{c.department} · {c.term}</p>
              </div>
              <span className="text-xs font-medium text-graphite-700">{c.progress}%</span>
            </a>
          ))}
        </div>
      )}
      {courses.length === 0 && <p className="mt-6 text-sm text-graphite-500">Loading courses…</p>}
    </main>
  );
}
