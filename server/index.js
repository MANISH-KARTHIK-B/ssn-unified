import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";
import { initDb } from "./db.js";
import { attachUser, requireAuth, requireFaculty, signToken } from "./auth.js";

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
  if (!entry) return res.status(404).json({ error: "Record not found" });
  const subject = entry.subjects.find((s) => s.subject === req.body.subject);
  if (!subject) return res.status(404).json({ error: "Subject not found" });
  subject.feeStatus = req.body.feeStatus;
  db.write();
  res.json(entry);
});

// ---------- COE: GRADESHEET VERIFICATION ----------
app.get("/api/coe/gradesheet-status", requireAuth, (req, res) => {
  res.json(db.data.coe.gradesheetStatus.find((c) => c.studentId === req.user.id) || { studentId: req.user.id, verified: false, verifiedOn: null });
});
app.get("/api/faculty/coe/gradesheet-status/:studentId", requireFaculty, (req, res) => {
  res.json(db.data.coe.gradesheetStatus.find((c) => c.studentId === req.params.studentId) || { studentId: req.params.studentId, verified: false, verifiedOn: null });
});
app.post("/api/faculty/coe/gradesheet-status/:studentId/toggle", requireFaculty, (req, res) => {
  const entry = db.data.coe.gradesheetStatus.find((c) => c.studentId === req.params.studentId);
  if (!entry) return res.status(404).json({ error: "Record not found" });
  entry.verified = !entry.verified;
  entry.verifiedOn = entry.verified ? new Date().toISOString().slice(0, 10) : null;
  db.write();
  res.json(entry);
});

// ---------- COE: PHOTOCOPY & REVALUATION ----------
app.get("/api/coe/photocopy-requests", requireAuth, (req, res) => {
  res.json(db.data.coe.photocopyRequests.filter((p) => p.studentId === req.user.id));
});
app.post("/api/coe/photocopy-requests", requireAuth, (req, res) => {
  const request = {
    id: nanoid(8),
    studentId: req.user.id,
    type: req.body.type,
    subject: req.body.subject,
    status: "Requested",
    requestedOn: new Date().toISOString().slice(0, 10)
  };
  db.data.coe.photocopyRequests.unshift(request);
  db.write();
  res.status(201).json(request);
});
app.get("/api/faculty/coe/photocopy-requests", requireFaculty, (req, res) => {
  const { studentId } = req.query;
  let list = db.data.coe.photocopyRequests;
  if (studentId) list = list.filter((p) => p.studentId === studentId);
  res.json(list);
});
app.post("/api/faculty/coe/photocopy-requests/:id/status", requireFaculty, (req, res) => {
  const request = db.data.coe.photocopyRequests.find((p) => p.id === req.params.id);
  if (!request) return res.status(404).json({ error: "Request not found" });
  request.status = req.body.status;
  db.write();
  res.json(request);
});

// ---------- AUTH: CHANGE PASSWORD ----------
app.post("/api/auth/change-password", requireAuth, (req, res) => {
  const user = db.data.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.password !== req.body.currentPassword) return res.status(401).json({ error: "Current password is incorrect" });
  if (!req.body.newPassword || req.body.newPassword.length < 4) return res.status(400).json({ error: "New password must be at least 4 characters" });
  user.password = req.body.newPassword;
  db.write();
  res.json({ ok: true });
});

// ---------- GATEPASS ----------
app.get("/api/gatepass", requireAuth, (req, res) => {
  res.json(db.data.gatepass.filter((p) => p.studentId === req.user.id));
});
app.post("/api/gatepass", requireAuth, (req, res) => {
  const { type, departure, return: returnTime, reason } = req.body;
  const pass = { id: nanoid(8), studentId: req.user.id, type, departure, return: returnTime, reason: reason || "", status: "Pending", approvals: { mentor: "Pending", security: "Not Required", warden: "Not Required" } };
  db.data.gatepass.unshift(pass);
  db.write();
  res.status(201).json(pass);
});

// ---------- FACULTY: GATEPASS ----------
app.get("/api/faculty/gatepass", requireFaculty, (req, res) => {
  const { studentId } = req.query;
  let list = db.data.gatepass;
  if (studentId) list = list.filter((p) => p.studentId === studentId);
  res.json(list);
});
app.post("/api/faculty/gatepass/:id/decision", requireFaculty, (req, res) => {
  const pass = db.data.gatepass.find((p) => p.id === req.params.id);
  if (!pass) return res.status(404).json({ error: "Pass not found" });
  const approve = req.body.decision === "approve";
  pass.approvals.mentor = approve ? "Approved" : "Rejected";
  pass.status = approve ? "Approved" : "Cancelled";
  db.write();
  res.json(pass);
});

// ---------- LIBRARY ----------
app.get("/api/library/catalog", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  res.json(db.data.library.catalog.filter((b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)));
});
app.get("/api/library/issued", requireAuth, (req, res) => {
  res.json(db.data.library.issued.filter((b) => b.id.startsWith(req.user.id)));
});

// ---------- HELPDESK ----------
app.get("/api/helpdesk/tickets", requireAuth, (req, res) => {
  res.json(db.data.helpdesk.tickets.filter((t) => t.studentId === req.user.id));
});
app.post("/api/helpdesk/tickets", requireAuth, (req, res) => {
  const { category, subject, description } = req.body;
  const ticket = { id: nanoid(8), studentId: req.user.id, category, subject, description, status: "Open", createdAt: new Date().toISOString().slice(0, 10), replies: [] };
  db.data.helpdesk.tickets.unshift(ticket);
  db.write();
  res.status(201).json(ticket);
});
app.post("/api/helpdesk/tickets/:id/reply", requireAuth, (req, res) => {
  const ticket = db.data.helpdesk.tickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  ticket.replies.push({ from: "student", text: req.body.text, at: new Date().toISOString().slice(0, 10) });
  db.write();
  res.json(ticket);
});

// ---------- FACULTY: HELPDESK ----------
app.get("/api/faculty/helpdesk/tickets", requireFaculty, (req, res) => {
  const { studentId } = req.query;
  let list = db.data.helpdesk.tickets;
  if (studentId) list = list.filter((t) => t.studentId === studentId);
  res.json(list);
});
app.post("/api/faculty/helpdesk/tickets/:id/reply", requireFaculty, (req, res) => {
  const ticket = db.data.helpdesk.tickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  ticket.replies.push({ from: "support", text: req.body.text, at: new Date().toISOString().slice(0, 10) });
  db.write();
  res.json(ticket);
});
app.post("/api/faculty/helpdesk/tickets/:id/status", requireFaculty, (req, res) => {
  const ticket = db.data.helpdesk.tickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  ticket.status = req.body.status;
  db.write();
  res.json(ticket);
});

// ---------- ERP ----------
app.get("/api/erp/fees", requireAuth, (req, res) => {
  res.json(db.data.erp.fees.find((f) => f.studentId === req.user.id) || { studentId: req.user.id, semesters: [] });
});
app.post("/api/erp/fees/:semester/pay", requireAuth, (req, res) => {
  const entry = db.data.erp.fees.find((f) => f.studentId === req.user.id);
  if (!entry) return res.status(404).json({ error: "No fee record" });
  const sem = entry.semesters.find((s) => s.semester === req.params.semester);
  if (!sem) return res.status(404).json({ error: "Semester not found" });
  sem.status = "Paid";
  sem.paidOn = new Date().toISOString().slice(0, 10);
  db.write();
  res.json(entry);
});
app.get("/api/erp/documents", requireAuth, (req, res) => {
  res.json(db.data.erp.documentRequests.filter((d) => d.studentId === req.user.id));
});
app.post("/api/erp/documents", requireAuth, (req, res) => {
  const doc = { id: nanoid(8), studentId: req.user.id, type: req.body.type, status: "Requested", requestedOn: new Date().toISOString().slice(0, 10) };
  db.data.erp.documentRequests.unshift(doc);
  db.write();
  res.status(201).json(doc);
});
app.get("/api/erp/hostel", requireAuth, (req, res) => {
  res.json(db.data.erp.hostel.find((h) => h.studentId === req.user.id) || null);
});

// ---------- HUB: ATTENDANCE ----------
app.get("/api/hub/attendance", requireAuth, (req, res) => {
  res.json(db.data.attendance.filter((a) => a.id.startsWith(req.user.id)));
});
app.post("/api/hub/attendance/mark", requireAuth, (req, res) => {
  const { subjectId, present } = req.body;
  const rec = db.data.attendance.find((a) => a.id === subjectId);
  if (!rec) return res.status(404).json({ error: "Subject not found" });
  rec.held += 1;
  if (present) rec.attended += 1;
  rec.percentage = Math.round((rec.attended / rec.held) * 1000) / 10;
  db.write();
  io.of("/attendance").emit("attendance:update", rec);
  res.json(rec);
});

// ---------- FACULTY: ATTENDANCE ----------
app.get("/api/faculty/attendance/:studentId", requireFaculty, (req, res) => {
  res.json(db.data.attendance.filter((a) => a.id.startsWith(req.params.studentId)));
});

// ---------- HUB: MESS ----------
app.get("/api/hub/mess", (req, res) => res.json(db.data.mess.menu));
app.get("/api/hub/mess/feedback", (req, res) => {
  const feedback = db.data.mess.feedback.slice(0, 20).map((f) => {
    const student = db.data.users.find((u) => u.id === f.studentId);
    return { ...f, studentName: student ? student.name : "Student" };
  });
  res.json(feedback);
});
app.post("/api/hub/mess/feedback", requireAuth, (req, res) => {
  const feedback = { id: nanoid(8), studentId: req.user.id, meal: req.body.meal, day: req.body.day, rating: req.body.rating, comment: req.body.comment || "", at: new Date().toISOString() };
  db.data.mess.feedback.unshift(feedback);
  db.write();
  res.status(201).json(feedback);
});

// ---------- HUB: MENTOR BOOKING ----------
app.get("/api/hub/mentors", (req, res) => res.json(db.data.mentors));
app.get("/api/hub/appointments", requireAuth, (req, res) => {
  res.json(db.data.appointments.filter((a) => a.studentId === req.user.id));
});
app.post("/api/hub/appointments", requireAuth, (req, res) => {
  const appt = { id: nanoid(8), studentId: req.user.id, mentorId: req.body.mentorId, slot: req.body.slot, status: "Pending", reply: "" };
  db.data.appointments.unshift(appt);
  db.write();
  res.status(201).json(appt);
});
app.post("/api/hub/appointments/:id/cancel", requireAuth, (req, res) => {
  const appt = db.data.appointments.find((a) => a.id === req.params.id && a.studentId === req.user.id);
  if (!appt) return res.status(404).json({ error: "Appointment not found" });
  appt.status = "Cancelled";
  db.write();
  res.json(appt);
});

// ---------- FACULTY: MENTOR BOOKING ----------
app.get("/api/faculty/appointments", requireFaculty, (req, res) => {
  const { studentId } = req.query;
  let list = db.data.appointments;
  if (studentId) list = list.filter((a) => a.studentId === studentId);
  res.json(list);
});
app.post("/api/faculty/appointments/:id/status", requireFaculty, (req, res) => {
  const appt = db.data.appointments.find((a) => a.id === req.params.id);
  if (!appt) return res.status(404).json({ error: "Appointment not found" });
  appt.status = req.body.status;
  if (req.body.reply !== undefined) appt.reply = req.body.reply;
  db.write();
  res.json(appt);
});

// ---------- HUB: EVENT CATALOG ----------
app.get("/api/hub/events", (req, res) => res.json(db.data.events));
app.get("/api/hub/events/registrations", requireAuth, (req, res) => {
  res.json(db.data.eventRegistrations.filter((r) => r.studentId === req.user.id));
});
app.post("/api/hub/events/:id/register", requireAuth, (req, res) => {
  const event = db.data.events.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  const already = db.data.eventRegistrations.find((r) => r.eventId === event.id && r.studentId === req.user.id);
  if (already) return res.status(409).json({ error: "Already registered" });
  const registration = { id: nanoid(8), eventId: event.id, studentId: req.user.id, registeredAt: new Date().toISOString() };
  db.data.eventRegistrations.push(registration);
  db.write();
  res.status(201).json(registration);
});

// ---------- HUB: BUS ROUTES ----------
app.get("/api/hub/bus-routes", (req, res) => res.json(db.data.busRoutes));

// ---------- SOCKET.IO: live bus simulation ----------
const busNs = io.of("/bus");
let busProgress = {};
db.data.busRoutes.forEach((r) => (busProgress[r.id] = Math.random()));

function interpolate(path, t) {
  const segCount = path.length - 1;
  const segT = t * segCount;
  const segIdx = Math.min(Math.floor(segT), segCount - 1);
  const localT = segT - segIdx;
  const [lat1, lng1] = path[segIdx];
  const [lat2, lng2] = path[segIdx + 1];
  return [lat1 + (lat2 - lat1) * localT, lng1 + (lng2 - lng1) * localT];
}

setInterval(() => {
  const positions = db.data.busRoutes.map((r) => {
    busProgress[r.id] = (busProgress[r.id] + 0.01) % 1;
    const pos = interpolate(r.path, busProgress[r.id]);
    const stopsRemaining = Math.max(1, Math.round((1 - busProgress[r.id]) * (r.stops.length - 1)) + 1);
    return { routeId: r.id, lat: pos[0], lng: pos[1], progress: busProgress[r.id], nextStop: r.stops[Math.min(r.stops.length - 1, r.stops.length - stopsRemaining)], etaMinutes: Math.max(1, Math.round((1 - (busProgress[r.id] % 1)) * 25)) };
  });
  busNs.emit("bus:positions", positions);
}, 2000);

busNs.on("connection", (socket) => socket.emit("bus:routes", db.data.busRoutes));
io.of("/attendance").on("connection", () => {});

app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

server.listen(PORT, () => {
  console.log(`SSN Unified shared backend running on http://localhost:${PORT}`);
});
