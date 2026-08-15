import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";
import { initDb } from "./db.js";
import { attachUser, requireAuth, signToken } from "./auth.js";

const PORT = process.env.PORT || 4000;
const db = await initDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(attachUser);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ---------- AUTH ----------
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.data.users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ error: "Invalid username or password" });
  const token = signToken(user);
  const { password: _pw, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = db.data.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password: _pw, ...safeUser } = user;
  res.json(safeUser);
});

app.get("/api/auth/demo-accounts", (req, res) => {
  res.json(
    db.data.users.map((u) => ({ username: u.username, password: u.password, role: u.role, name: u.name }))
  );
});

// ---------- PROFILE (shared) ----------
app.get("/api/profile", requireAuth, (req, res) => {
  const user = db.data.users.find((u) => u.id === req.user.id);
  const { password: _pw, ...safeUser } = user;
  res.json(safeUser);
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
  course.units.forEach((u) => {
    u.lessons.forEach((l) => {
      if (l.id === req.params.lessonId) {
        l.done = !l.done;
        found = l;
      }
    });
  });
  if (!found) return res.status(404).json({ error: "Lesson not found" });
  const total = course.units.flatMap((u) => u.lessons).length;
  const done = course.units.flatMap((u) => u.lessons).filter((l) => l.done).length;
  course.progress = Math.round((done / total) * 100);
  db.write();
  res.json(course);
});

// ---------- COE ----------
app.get("/api/coe/cat-marks", requireAuth, (req, res) => {
  const entry = db.data.coe.catMarks.find((c) => c.studentId === req.user.id);
  res.json(entry || { studentId: req.user.id, subjects: [] });
});
app.get("/api/coe/timetable", requireAuth, (req, res) => {
  res.json(db.data.coe.timetable);
});
app.get("/api/coe/results", requireAuth, (req, res) => {
  const entry = db.data.coe.results.find((c) => c.studentId === req.user.id);
  res.json(entry || { studentId: req.user.id, semesters: [], cgpa: null });
});

// ---------- GATEPASS ----------
app.get("/api/gatepass", requireAuth, (req, res) => {
  const passes = db.data.gatepass.filter((p) => p.studentId === req.user.id);
  res.json(passes);
});
app.post("/api/gatepass", requireAuth, (req, res) => {
  const { type, departure, return: returnTime, reason } = req.body;
  const pass = {
    id: nanoid(8),
    studentId: req.user.id,
    type,
    departure,
    return: returnTime,
    reason: reason || "",
    status: "Pending",
    approvals: { mentor: "Pending", security: "Not Required", warden: "Not Required" }
  };
  db.data.gatepass.unshift(pass);
  db.write();
  res.status(201).json(pass);
});

// ---------- LIBRARY ----------
app.get("/api/library/catalog", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const results = db.data.library.catalog.filter(
    (b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
  );
  res.json(results);
});
app.get("/api/library/issued", requireAuth, (req, res) => {
  const issued = db.data.library.issued.filter((b) => b.studentId === req.user.id || b.id.startsWith(req.user.id));
  res.json(issued);
});

// ---------- HELPDESK ----------
app.get("/api/helpdesk/tickets", requireAuth, (req, res) => {
  res.json(db.data.helpdesk.tickets.filter((t) => t.studentId === req.user.id));
});
app.post("/api/helpdesk/tickets", requireAuth, (req, res) => {
  const { category, subject, description } = req.body;
  const ticket = {
    id: nanoid(8),
    studentId: req.user.id,
    category,
    subject,
    description,
    status: "Open",
    createdAt: new Date().toISOString().slice(0, 10),
    replies: []
  };
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

// ---------- ERP ----------
app.get("/api/erp/fees", requireAuth, (req, res) => {
  const entry = db.data.erp.fees.find((f) => f.studentId === req.user.id);
  res.json(entry || { studentId: req.user.id, semesters: [] });
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
  const doc = {
    id: nanoid(8),
    studentId: req.user.id,
    type: req.body.type,
    status: "Requested",
    requestedOn: new Date().toISOString().slice(0, 10)
  };
  db.data.erp.documentRequests.unshift(doc);
  db.write();
  res.status(201).json(doc);
});
app.get("/api/erp/hostel", requireAuth, (req, res) => {
  const entry = db.data.erp.hostel.find((h) => h.studentId === req.user.id);
  res.json(entry || null);
});

// ---------- HUB: ATTENDANCE ----------
app.get("/api/hub/attendance", requireAuth, (req, res) => {
  res.json(db.data.attendance.filter((a) => a.id.startsWith(req.user.id)));
});
app.post("/api/hub/attendance/mark", requireAuth, (req, res) => {
  // Teacher/mentor marks attendance for a subject across students; simplified demo version
  // marks the current authenticated demo student for a subject id.
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

// ---------- HUB: MESS ----------
app.get("/api/hub/mess", (req, res) => {
  res.json(db.data.mess.menu);
});
app.get("/api/hub/mess/feedback", (req, res) => {
  const feedback = db.data.mess.feedback.slice(0, 20).map((f) => {
    const student = db.data.users.find((u) => u.id === f.studentId);
    return { ...f, studentName: student ? student.name : "Student" };
  });
  res.json(feedback);
});
app.post("/api/hub/mess/feedback", requireAuth, (req, res) => {
  const feedback = {
    id: nanoid(8),
    studentId: req.user.id,
    meal: req.body.meal,
    day: req.body.day,
    rating: req.body.rating,
    comment: req.body.comment || "",
    at: new Date().toISOString()
  };
  db.data.mess.feedback.unshift(feedback);
  db.write();
  res.status(201).json(feedback);
});

// ---------- HUB: MENTOR BOOKING ----------
app.get("/api/hub/mentors", (req, res) => {
  res.json(db.data.mentors);
});
app.get("/api/hub/appointments", requireAuth, (req, res) => {
  res.json(db.data.appointments.filter((a) => a.studentId === req.user.id));
});
app.post("/api/hub/appointments", requireAuth, (req, res) => {
  const appt = {
    id: nanoid(8),
    studentId: req.user.id,
    mentorId: req.body.mentorId,
    slot: req.body.slot,
    status: "Pending"
  };
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

// ---------- HUB: EVENT CATALOG ----------
app.get("/api/hub/events", (req, res) => {
  res.json(db.data.events);
});
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

// ---------- HUB: BUS ROUTES (static list; live positions over socket) ----------
app.get("/api/hub/bus-routes", (req, res) => {
  res.json(db.data.busRoutes);
});

// ---------- SOCKET.IO: live bus simulation ----------
const busNs = io.of("/bus");
let busProgress = {}; // routeId -> 0..1 progress along path
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
    return {
      routeId: r.id,
      lat: pos[0],
      lng: pos[1],
      progress: busProgress[r.id],
      nextStop: r.stops[Math.min(r.stops.length - 1, r.stops.length - stopsRemaining)],
      etaMinutes: Math.max(1, Math.round((1 - (busProgress[r.id] % 1)) * 25))
    };
  });
  busNs.emit("bus:positions", positions);
}, 2000);

busNs.on("connection", (socket) => {
  socket.emit("bus:routes", db.data.busRoutes);
});

const attendanceNs = io.of("/attendance");
attendanceNs.on("connection", () => {});

app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

server.listen(PORT, () => {
  console.log(`SSN Unified shared backend running on http://localhost:${PORT}`);
});
