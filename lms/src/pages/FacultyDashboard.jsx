import React, { useEffect, useState } from "react";
import { Plus, Users, ClipboardList, FileCheck2 } from "lucide-react";
import { api } from "../lib/api";

function StudentPicker({ value, onChange }) {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    api.get("/api/faculty/students").then((res) => setStudents(res.data));
  }, []);
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
      <Users className="h-4 w-4 text-graphite-500" />
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-sm text-graphite-900 outline-none">
        <option value="">Select a student…</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>{s.name} — {s.regNo}</option>
        ))}
      </select>
    </div>
  );
}

function NewAssignmentForm({ courses }) {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!courseId) return;
    setBusy(true);
    try {
      await api.post(`/api/faculty/lms/courses/${courseId}/assignments`, { title, description, dueDate });
      setSuccess(true);
      setTitle("");
      setDescription("");
      setDueDate("");
      setTimeout(() => setSuccess(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
      <p className="flex items-center gap-2 font-display text-sm font-bold text-graphite-900">
        <ClipboardList className="h-4 w-4 text-violet-600" /> Assign new work
      </p>
      <select required value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
        <option value="">Choose a course…</option>
        {courses.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
      </select>
      <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
      <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
      <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-500 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-60">
        <Plus className="h-4 w-4" /> {busy ? "Assigning…" : "Assign to course"}
      </button>
      {success && <p className="text-xs text-green-600">Assignment added — students will see it immediately.</p>}
    </form>
  );
}

function SubmissionsPanel() {
  const [studentId, setStudentId] = useState("");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (!studentId) {
      setSubmissions([]);
      return;
    }
    api.get(`/api/faculty/lms/students/${studentId}/submissions`).then((res) => setSubmissions(res.data));
  }, [studentId]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 font-display text-sm font-bold text-graphite-900">
          <FileCheck2 className="h-4 w-4 text-violet-600" /> Student submissions
        </p>
        <StudentPicker value={studentId} onChange={setStudentId} />
      </div>
      {!studentId && <p className="text-sm text-graphite-500">Select a student to see everything they have submitted.</p>}
      {studentId && submissions.length === 0 && <p className="text-sm text-graphite-500">No submissions from this student yet.</p>}
      <div className="space-y-3">
        {submissions.map((s) => (
          <div key={s.id} className="rounded-xl border border-gray-100 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-graphite-900">{s.assignmentTitle}</p>
              <span className="text-xs text-graphite-500">{new Date(s.submittedAt).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-graphite-500">{s.courseTitle}</p>
            {s.note && <p className="mt-1 text-xs text-graphite-600">"{s.note}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FacultyDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/api/lms/courses").then((res) => setCourses(res.data));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-1 font-display text-2xl font-bold text-graphite-900">Faculty Dashboard</h1>
      <p className="mb-6 text-sm text-graphite-500">Assign coursework and review what students have submitted.</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NewAssignmentForm courses={courses} />
        <SubmissionsPanel />
      </div>
    </main>
  );
}
