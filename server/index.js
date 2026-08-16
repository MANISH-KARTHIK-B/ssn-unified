import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";
import { initDb } from "./db.js";
import { attachUser, requireAuth, requireFaculty, requireWarden, signToken } from "./auth.js";

const PORT = process.env.PORT || 4000;
const db = await initDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); 
app.use(attachUser);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

function safeUser(u) {
  const { password: _pw, ...rest } = u;
  return rest;
}

// ---------- AUTH ----------
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.data.users.find((u) => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid username or password" });
  res.json({ token: signToken(user), user: safeUser(user) });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = db.data.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(safeUser(user));
});

app.get("/api/auth/demo-accounts", (req, res) => {
  res.json(db.data.users.map((u) => ({ username: u.username, password: u.password, role: u.role, name: u.name })));
});

// ---------- PROFILE ----------
app.get("/api/profile", requireAuth, (req, res) => {
  const user = db.data.users.find((u) => u.id === req.user.id);
  res.json(safeUser(user));
});

// ---------- FACULTY: STUDENT DIRECTORY ----------
app.get("/api/faculty/students", requireFaculty, (req, res) => {
  const students = db.data.users.filter((u) => u.role === "student").map(safeUser);
  res.json(students);
});
app.get("/api/faculty/students/:id", requireFaculty, (req, res) => {
  const student = db.data.users.find((u) => u.id === req.params.id && u.role === "student");
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(safeUser(student));
});

// ---------- LMS ----------
app.get("/api/lms/courses", requireAuth, (req, res) => {
  res.json(db.data.courses);
});
app.get("/api/lms/courses/:id", requireAuth, (req, res) => {
  const course = db.data.courses.find((c) => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
});
app.post("/api/lms/courses/:id/lessons/:lessonId/toggle", requireAuth, (req, res) => {
  const course = db.data.courses.find((c) => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  let found = null;
  course.units.forEach((u) => u.lessons.forEach((l) => { if (l.id === req.params.lessonId) { l.done = !l.done; found = l; } }));
  if (!found) return res.status(404).json({ error: "Lesson not found" });
  const total = course.units.flatMap((u) => u.lessons).length;
  const done = course.units.flatMap((u) => u.lessons).filter((l) => l.done).length;
  course.progress = Math.round((done / total) * 100);
  db.write();
  res.json(course);
});
// Student submits an assignment (mock: a text note stands in for a file upload).
app.post("/api/lms/courses/:id/assignments/:assignmentId/submit", requireAuth, (req, res) => {
  const course = db.data.courses.find((c) => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  const assignment = course.assignments.find((a) => a.id === req.params.assignmentId);
  if (!assignment) return res.status(404).json({ error: "Assignment not found" });
  const existing = db.data.lmsSubmissions.find((s) => s.assignmentId === assignment.id && s.studentId === req.user.id);
  const submission = existing || { id: nanoid(8), assignmentId: assignment.id, courseId: course.id, studentId: req.user.id };
  submission.note = req.body.note || "";
  submission.fileName = req.body.fileName || "submission.txt";
  submission.submittedAt = new Date().toISOString();
  if (!existing) db.data.lmsSubmissions.push(submission);
  db.write();
  res.status(201).json(submission);
});
app.get("/api/lms/courses/:id/my-submissions", requireAuth, (req, res) => {
  res.json(db.data.lmsSubmissions.filter((s) => s.courseId === req.params.id && s.studentId === req.user.id));
});

// ---------- FACULTY: LMS ----------
app.post("/api/faculty/lms/courses/:id/assignments", requireFaculty, (req, res) => {
  const course = db.data.courses.find((c) => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  const assignment = { id: nanoid(8), title: req.body.title, description: req.body.description || "", dueDate: req.body.dueDate };
  course.assignments.push(assignment);
  db.write();
  res.status(201).json(assignment);
});
app.get("/api/faculty/lms/students/:studentId/submissions", requireFaculty, (req, res) => {
  const submissions = db.data.lmsSubmissions.filter((s) => s.studentId === req.params.studentId);
  const withDetails = submissions.map((s) => {
    const course = db.data.courses.find((c) => c.id === s.courseId);
    const assignment = course?.assignments.find((a) => a.id === s.assignmentId);
    return { ...s, courseTitle: course?.title, assignmentTitle: assignment?.title };
  });
  res.json(withDetails);
});

// ---------- COE ----------
app.get("/api/coe/cat-marks", requireAuth, (req, res) => {
  res.json(db.data.coe.catMarks.find((c) => c.studentId === req.user.id) || { studentId: req.user.id, subjects: [] });
});
app.get("/api/coe/timetable", requireAuth, (req, res) => res.json(db.data.coe.timetable));
app.get("/api/coe/results", requireAuth, (req, res) => {
  res.json(db.data.coe.results.find((c) => c.studentId === req.user.id) || { studentId: req.user.id, semesters: [], cgpa: null });
});

// ---------- FACULTY: COE ----------
app.get("/api/faculty/coe/cat-marks/:studentId", requireFaculty, (req, res) => {
  res.json(db.data.coe.catMarks.find((c) => c.studentId === req.params.studentId) || { studentId: req.params.studentId, subjects: [] });
});
app.put("/api/faculty/coe/cat-marks/:studentId", requireFaculty, (req, res) => {
  const entry = db.data.coe.catMarks.find((c) => c.studentId === req.params.studentId);
  if (!entry) return res.status(404).json({ error: "Record not found" });
  const subject = entry.subjects.find((s) => s.subject === req.body.subject);
  if (!subject) return res.status(404).json({ error: "Subject not found" });
  if (req.body.cat1 !== undefined) subject.cat1 = Number(req.body.cat1);
  if (req.body.cat2 !== undefined) subject.cat2 = Number(req.body.cat2);
  db.write();
  res.json(entry);
});
app.get("/api/faculty/coe/results/:studentId", requireFaculty, (req, res) => {
  res.json(db.data.coe.results.find((c) => c.studentId === req.params.studentId) || { studentId: req.params.studentId, semesters: [], cgpa: null });
});
app.put("/api/faculty/coe/results/:studentId", requireFaculty, (req, res) => {
  const entry = db.data.coe.results.find((c) => c.studentId === req.params.studentId);
  if (!entry) return res.status(404).json({ error: "Record not found" });
  const sem = entry.semesters.find((s) => s.semester === req.body.semester);
  if (!sem) return res.status(404).json({ error: "Semester not found" });
  const subject = sem.subjects.find((s) => s.subject === req.body.subject);
  if (subject && req.body.grade) subject.grade = req.body.grade;
  if (req.body.sgpa !== undefined) sem.sgpa = Number(req.body.sgpa);
  if (req.body.cgpa !== undefined) entry.cgpa = Number(req.body.cgpa);
  db.write();
  res.json(entry);
});
// ---------- COE: INTERNAL MARKS ----------
app.get("/api/coe/internal-marks", requireAuth, (req, res) => {
  res.json(db.data.coe.internalMarks.find((c) => c.studentId === req.user.id) || { studentId: req.user.id, subjects: [] });
});
app.get("/api/faculty/coe/internal-marks/:studentId", requireFaculty, (req, res) => {
  res.json(db.data.coe.internalMarks.find((c) => c.studentId === req.params.studentId) || { studentId: req.params.studentId, subjects: [] });
});
app.put("/api/faculty/coe/internal-marks/:studentId", requireFaculty, (req, res) => {
  const entry = db.data.coe.internalMarks.find((c) => c.studentId === req.params.studentId);
  if (!entry) return res.status(404).json({ error: "Record not found" });
  const subject = entry.subjects.find((s) => s.subject === req.body.subject);
  if (!subject) return res.status(404).json({ error: "Subject not found" });
  subject.internal = Number(req.body.internal);
  db.write();
  res.json(entry);
});

// ---------- COE: REGISTERED SUBJECTS & EXAM FEES ----------
app.get("/api/coe/registered-subjects", requireAuth, (req, res) => {
  res.json(db.data.coe.registeredSubjects.find((c) => c.studentId === req.user.id) || { studentId: req.user.id, subjects: [] });
});
app.get("/api/faculty/coe/registered-subjects/:studentId", requireFaculty, (req, res) => {
  res.json(db.data.coe.registeredSubjects.find((c) => c.studentId === req.params.studentId) || { studentId: req.params.studentId, subjects: [] });
});
app.put("/api/faculty/coe/registered-subjects/:studentId", requireFaculty, (req, res) => {
  const entry = db.data.coe.registeredSubjects.find((c) => c.studentId === req.params.studentId);
  if (!entry) return res.status(404).json({ error:
