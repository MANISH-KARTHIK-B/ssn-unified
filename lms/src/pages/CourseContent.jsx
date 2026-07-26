import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, FileText, File, List, ArrowLeft, Check } from "lucide-react";
import { api } from "../lib/api";

function LessonIcon({ type }) {
  return type === "pdf" ? (
    <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-100 text-red-600"><FileText className="h-4 w-4" /></div>
  ) : (
    <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-100 text-blue-600"><File className="h-4 w-4" /></div>
  );
}

function Unit({ unit, onToggle }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 px-5 py-4 text-left">
        <ChevronDown className={`h-4 w-4 text-graphite-500 transition ${open ? "" : "-rotate-90"}`} />
        <span className="font-display text-sm font-bold uppercase tracking-wide text-graphite-900">{unit.title}</span>
      </button>
      {open && (
        <div className="space-y-2 px-5 pb-5">
          {unit.lessons.map((l) => (
            <div key={l.id} className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-3">
              <LessonIcon type={l.type} />
              <a href="#" className="flex-1 text-sm font-medium text-violet-700 hover:underline">{l.title}</a>
              <button
                onClick={() => onToggle(l.id)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                  l.done ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 text-graphite-600 hover:border-violet-400"
                }`}
              >
                {l.done && <Check className="h-3.5 w-3.5" />}
                {l.done ? "Done" : "Mark as done"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CourseContent() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.get(`/api/lms/courses/${id}`).then((res) => setCourse(res.data));
  }, [id]);

  async function toggleLesson(lessonId) {
    const res = await api.post(`/api/lms/courses/${id}/lessons/${lessonId}/toggle`);
    setCourse(res.data);
  }

  if (!course) return <main className="px-6 py-8 text-sm text-graphite-500">Loading…</main>;

  return (
    <div className="flex">
      <aside className="sticky top-14 flex h-[calc(100vh-56px)] w-14 shrink-0 flex-col items-center gap-3 border-r border-gray-200 bg-white py-4">
        <button className="grid h-9 w-9 place-items-center rounded-lg bg-violet-100 text-violet-700"><List className="h-4 w-4" /></button>
      </aside>
      <main className="mx-auto max-w-4xl flex-1 px-6 py-8">
        <Link to="/" className="mb-4 flex items-center gap-1.5 text-xs text-graphite-500 hover:text-violet-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to My courses
        </Link>
        <h1 className="mb-6 font-display text-xl font-bold text-graphite-900">{course.code} — {course.title}</h1>
        {course.units.map((u) => <Unit key={u.id} unit={u} onToggle={toggleLesson} />)}
      </main>
    </div>
  );
}
