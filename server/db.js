import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });
const file = path.join(dataDir, "db.json");
const adapter = new JSONFile(file);

export const db = new Low(adapter, {});

const DEPARTMENTS = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Information Technology"
];

function pick(arr, i) {
  return arr[i % arr.length];
}

// Only 3 demo student accounts, as requested, instead of a large fictional roster.
function buildStudents() {
  const names = ["One", "Two", "Three"];
  const students = [];
  for (let i = 1; i <= 3; i++) {
    const dept = pick(DEPARTMENTS, i - 1);
    students.push({
      id: `student${i}`,
      username: `student${i}`,
      password: "demo1234",
      role: "student",
      name: `Student ${names[i - 1]}`,
      regNo: `REG2026${String(i).padStart(3, "0")}`,
      digitalId: `${2510000 + i}`,
      department: dept,
      program: `B.E. ${dept}`,
      batch: "2026",
      section: pick(["A", "B"], i - 1),
      regulation: "2024",
      dob: `0${(i % 9) + 1}.0${((i + 2) % 9) + 1}.2007`,
      gender: i % 2 === 0 ? "female" : "male",
      email: `student${i}@example-college.edu`,
      govtIdNo: `XXXX-XXXX-${1000 + i}`,
      avatar: "generic",
      cgpa: (7 + (i % 3) * 0.4).toFixed(2)
    });
  }
  return students;
}

// A single unified faculty/mentor account for this prototype - one login, full edit rights
// across every module (COE, LMS, Helpdesk, Attendance, Gatepass, Mentor Booking).
function buildFaculty() {
  return [
    {
      id: "faculty1",
      username: "faculty1",
      password: "demo1234",
      role: "faculty",
      name: "Dr. Faculty Mentor",
      department: "Common Faculty",
      email: "faculty1@example-college.edu",
      avatar: "generic"
    }
  ];
}

const COURSE_BANNERS = ["hexagon", "diamond", "wave", "grid", "plaid", "circuit"];
const COURSE_SEED = [
  { code: "UCE3386", title: "Design Thinking and Innovation", dept: "Common", term: "AY 2026-27 Term I" },
  { code: "UEC3301", title: "Electronic Circuits", dept: "ECE", term: "AY 2026-27 Term I" },
  { code: "UEC3302", title: "OOPS and Data Structures III", dept: "IT", term: "AY 2026-27 Term I" },
  { code: "UEC3303", title: "Signals and Systems", dept: "ECE", term: "AY 2026-27 Term I" },
  { code: "UCS3401", title: "Operating Systems", dept: "CSE", term: "AY 2026-27 Term I" }
];

function buildCourses() {
  return COURSE_SEED.map((c, i) => ({
    id: `course${i + 1}`,
    code: c.code,
    title: c.title,
    department: c.dept,
    term: c.term,
    banner: pick(COURSE_BANNERS, i),
    progress: [25, 0, 76, 50, 60][i % 5],
    units: [
      {
        id: `u${i + 1}-1`,
        title: "Unit I: Foundations",
        lessons: [
          { id: `${i}-l1`, title: "Introduction and Course Overview", type: "pdf", done: true },
          { id: `${i}-l2`, title: "Core Concepts Walkthrough", type: "pdf", done: [25, 0, 76, 50, 60][i % 5] > 20 },
          { id: `${i}-l3`, title: "Worked Examples", type: "pdf", done: false }
        ]
      },
      {
        id: `u${i + 1}-2`,
        title: "Unit II: Applications",
        lessons: [
          { id: `${i}-l4`, title: "Case Study Discussion", type: "pdf", done: false },
          { id: `${i}-l5`, title: "Lab Reference Sheet", type: "doc", done: false }
        ]
      }
    ],
    // Faculty-assigned coursework. Students submit against these; faculty can view submissions.
    assignments: [
      {
        id: `${c.code}-a1`,
        title: `${c.title} — Assignment 1`,
        description: "Solve the problem set covering Unit I concepts.",
        dueDate: "2026-08-20"
      }
    ]
  }));
}

function buildGatepass(studentId, seedIndex) {
  const types = ["Weekend Pass", "Holiday Pass", "Working Day Pass"];
  const reasons = ["Family Function", "Medical", "Personal Work"];
  const baseDates = [
    ["2026-08-01T15:55", "2026-08-03T07:55"],
    ["2026-08-05T16:00", "2026-08-06T20:00"],
    ["2026-08-10T09:00", "2026-08-10T18:00"]
  ];
  return baseDates.map((d, i) => ({
    id: `${studentId}-pass${i + 1}`,
    studentId,
    type: pick(types, i + seedIndex),
    reason: pick(reasons, i + seedIndex),
    departure: d[0],
    return: d[1],
    status: "Pending",
    approvals: { mentor: "Pending", security: "Not Required", warden: "Not Required" }
  }));
}

function buildLibraryCatalog() {
  return [
    { id: "b1", title: "Principles of Digital Electronics", author: "R. Menon", available: true, copies: 3 },
    { id: "b2", title: "Signals, Systems and Transforms", author: "A. Krishnan", available: true, copies: 2 },
    { id: "b3", title: "Data Structures with Object Orientation", author: "S. Iyer", available: false, copies: 0 },
    { id: "b4", title: "Introduction to Operating Systems", author: "P. Raghavan", available: true, copies: 5 },
    { id: "b5", title: "Engineering Thermodynamics", author: "V. Subramaniam", available: true, copies: 1 },
    { id: "b6", title: "Circuit Theory and Networks", author: "K. Bala", available: true, copies: 4 }
  ];
}

function buildIssuedBooks(studentId) {
  return [
    { id: `${studentId}-issue1`, bookId: "b2", title: "Signals, Systems and Transforms", issuedOn: "2026-06-10", dueOn: "2026-07-24", returned: false }
  ];
}

function buildBusRoutes() {
  return [
    { id: "route1", name: "Route 1 - Tambaram", driver: "Driver A", stops: ["Tambaram", "Chromepet", "Pallavaram", "Campus Gate"], path: [[12.9249, 80.1], [12.9516, 80.1462], [12.9675, 80.1491], [12.8406, 80.1534]] },
    { id: "route2", name: "Route 2 - Velachery", driver: "Driver B", stops: ["Velachery", "Medavakkam", "Sholinganallur", "Campus Gate"], path: [[12.9756, 80.2207], [12.9186, 80.1953], [12.901, 80.2279], [12.8406, 80.1534]] },
    { id: "route3", name: "Route 3 - T. Nagar", driver: "Driver C", stops: ["T. Nagar", "Guindy", "St. Thomas Mount", "Campus Gate"], path: [[13.0418, 80.2341], [13.0067, 80.2206], [13.0067, 80.1958], [12.8406, 80.1534]] }
  ];
}

function buildAttendance(studentId) {
  const subjects = ["Electronic Circuits", "OOPS and Data Structures", "Signals and Systems", "Operating Systems"];
  return subjects.map((s, i) => {
    const held = 30 + i * 2;
    const attended = Math.round(held * [0.92, 0.78, 0.68, 0.83][i % 4]);
    return { id: `${studentId}-att${i + 1}`, studentId, subject: s, held, attended, percentage: Math.round((attended / held) * 1000) / 10 };
  });
}

function buildMentors() {
  // A single bookable mentor profile, matching the one faculty login account in this prototype.
  return [{ id: "mentor1", name: "Dr. Faculty Mentor", department: "Common Faculty", slots: ["Mon 10:00", "Mon 14:00", "Wed 11:00", "Thu 15:00", "Fri 10:00"] }];
}

function buildMessMenu() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days.map((d) => ({
    day: d,
    breakfast: "Idli, Sambar, Chutney, Tea/Coffee",
    lunch: "Rice, Sambar, Poriyal, Rasam, Curd",
    snacks: "Bajji, Tea",
    dinner: "Chapati, Kurma, Rice, Curd"
  }));
}

function buildEvents() {
  return [
    { id: "evt1", title: "Shaastra Robotics Challenge", college: "IIT Madras", department: "Mechanical / Robotics", category: "Technical", mode: "Offline", venue: "IIT Madras Campus, Chennai", eventDate: "2026-08-14", registrationDeadline: "2026-08-05", description: "A multi-round autonomous and manual robotics competition open to inter-college teams." },
    { id: "evt2", title: "SSN Tech Symposium", college: "SSN College of Engineering", department: "Computer Science and Engineering", category: "Technical", mode: "Offline", venue: "SSN Main Auditorium", eventDate: "2026-08-30", registrationDeadline: "2026-08-27", description: "Paper presentations, coding contests and a project expo across CSE and IT streams." },
    { id: "evt3", title: "Riviera Cultural Fest", college: "VIT Vellore", department: "Cultural Committee", category: "Cultural", mode: "Offline", venue: "VIT Vellore Campus", eventDate: "2026-09-05", registrationDeadline: "2026-08-20", description: "One of the largest student-run cultural festivals with music, dance and design events." },
    { id: "evt4", title: "Techkriti Innovation Meet", college: "IIT Bombay", department: "Electronics and Communication", category: "Technical", mode: "Hybrid", venue: "IIT Bombay Campus, Mumbai", eventDate: "2026-08-22", registrationDeadline: "2026-08-10", description: "Startup showcases, hardware hackathons and innovation talks." },
    { id: "evt5", title: "Pragyan National Tech Fest", college: "NIT Tiruchirappalli", department: "Electrical and Electronics", category: "Technical", mode: "Offline", venue: "NIT Trichy Campus", eventDate: "2026-09-12", registrationDeadline: "2026-08-30", description: "National-level technical fest with workshops, competitions and guest lectures." }
  ];
}

export async function initDb() {
  await db.read();
  if (!db.data || !db.data.users) {
    const students = buildStudents();
    db.data = {
      users: [...students, ...buildFaculty()],
      courses: buildCourses(),
      lmsSubmissions: [],
      gatepass: students.flatMap((s, i) => buildGatepass(s.id, i)),
      library: { catalog: buildLibraryCatalog(), issued: students.flatMap((s) => buildIssuedBooks(s.id)) },
      busRoutes: buildBusRoutes(),
      attendance: students.flatMap((s) => buildAttendance(s.id)),
      mentors: buildMentors(),
      appointments: [],
      mess: { menu: buildMessMenu(), feedback: [] },
      events: buildEvents(),
      eventRegistrations: [],
      coe: {
        catMarks: students.map((s) => ({
          studentId: s.id,
          subjects: [
            { subject: "Electronic Circuits", cat1: 42, cat2: 45, max: 50 },
            { subject: "OOPS and Data Structures", cat1: 38, cat2: 41, max: 50 },
            { subject: "Signals and Systems", cat1: 33, cat2: 36, max: 50 }
          ]
        })),
        internalMarks: students.map((s) => ({
          studentId: s.id,
          subjects: [
            { subject: "Electronic Circuits", internal: 46, max: 50 },
            { subject: "OOPS and Data Structures", internal: 41, max: 50 },
            { subject: "Signals and Systems", internal: 38, max: 50 }
          ]
        })),
        registeredSubjects: students.map((s) => ({
          studentId: s.id,
          subjects: [
            { subject: "Electronic Circuits", code: "UEC3301", credits: 4, examFee: 250, feeStatus: "Paid" },
            { subject: "OOPS and Data Structures", code: "UEC3302", credits: 4, examFee: 250, feeStatus: "Paid" },
            { subject: "Signals and Systems", code: "UEC3303", credits: 3, examFee: 200, feeStatus: "Due" }
          ]
        })),
        gradesheetStatus: students.map((s) => ({ studentId: s.id, verified: false, verifiedOn: null })),
        photocopyRequests: [],
        timetable: [
          { date: "2026-08-10", subject: "Electronic Circuits", time: "10:00 AM - 01:00 PM", hall: "Hall A1", seat: "A-14" },
          { date: "2026-08-12", subject: "OOPS and Data Structures", time: "10:00 AM - 01:00 PM", hall: "Hall B2", seat: "B-07" }
        ],
        results: students.map((s) => ({
          studentId: s.id,
          semesters: [
            {
              semester: "Semester 3",
              sgpa: 8.2,
              subjects: [
                { subject: "Electronic Circuits", grade: "A" },
                { subject: "OOPS and Data Structures", grade: "A+" },
                { subject: "Signals and Systems", grade: "B+" }
              ]
            }
          ],
          cgpa: s.cgpa
        }))
      },
      helpdesk: {
        tickets: [
          { id: "tk1", studentId: "student1", category: "IT Services", subject: "Wi-Fi not connecting in hostel block C", description: "Unable to connect to campus Wi-Fi since yesterday evening.", status: "Open", createdAt: "2026-07-20", replies: [] },
          { id: "tk2", studentId: "student2", category: "Academics", subject: "Gradesheet not verified", description: "My CAT1 gradesheet is still showing as unverified.", status: "Open", createdAt: "2026-07-23", replies: [] }
        ]
      },
      erp: {
        fees: students.map((s) => ({
          studentId: s.id,
          semesters: [
            { semester: "Semester 3", amount: 65000, status: "Paid", paidOn: "2026-01-15" },
            { semester: "Semester 4", amount: 65000, status: "Due", dueDate: "2026-08-05" }
          ]
        })),
        documentRequests: [],
        hostel: students.map((s) => ({ studentId: s.id, block: "Block C", room: "C-214", roomType: "Double sharing", status: "Allocated" }))
      }
    };
    await db.write();
  }
  return db;
}
