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
  "Information Technology",
  "Mechanical Engineering",
  "Chemical Engineering"
];

function pick(arr, i) {
  return arr[i % arr.length];
}

function buildStudents() {
  const students = [];
  for (let i = 1; i <= 8; i++) {
    const dept = pick(DEPARTMENTS, i - 1);
    students.push({
      id: `student${i}`,
      username: `student${i}`,
      password: "demo1234",
      role: "student",
      name: `Student ${["One","Two","Three","Four","Five","Six","Seven","Eight"][i - 1]}`,
      regNo: `REG2026${String(i).padStart(3, "0")}`,
      digitalId: `${2510000 + i}`,
      department: dept,
      program: `B.E. ${dept}`,
      batch: "2026",
      section: pick(["A", "B", "C"], i - 1),
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

function buildFaculty() {
  const roles = ["mentor", "teacher"];
  const faculty = [];
  for (let i = 1; i <= 4; i++) {
    faculty.push({
      id: `faculty${i}`,
      username: `faculty${i}`,
      password: "demo1234",
      role: i <= 3 ? "mentor" : "teacher",
      name: `Dr. Faculty Name ${i}`,
      department: pick(DEPARTMENTS, i - 1),
      email: `faculty${i}@example-college.edu`,
      avatar: "generic"
    });
  }
  return faculty;
}

function buildAdmins() {
  return [
    {
      id: "admin1",
      username: "admin1",
      password: "demo1234",
      role: "admin",
      name: "Admin One",
      email: "admin1@example-college.edu",
      avatar: "generic"
    }
  ];
}

const COURSE_BANNERS = ["hexagon", "diamond", "wave", "grid", "plaid", "circuit", "dots", "ring"];
const COURSE_SEED = [
  { code: "UCE3386", title: "Design Thinking and Innovation", dept: "Common", term: "AY 2026-27 Term I" },
  { code: "UEC3301", title: "Electronic Circuits", dept: "ECE", term: "AY 2026-27 Term I" },
  { code: "UEC3302", title: "OOPS and Data Structures III", dept: "IT", term: "AY 2026-27 Term I" },
  { code: "UEC3303", title: "Signals and Systems", dept: "ECE", term: "AY 2026-27 Term I" },
  { code: "UEC3311", title: "Electronic Circuits Lab", dept: "ECE", term: "AY 2026-27 Term I" },
  { code: "UEC3312", title: "OOPS and Data Structures Lab", dept: "IT", term: "AY 2026-27 Term I" },
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
    progress: [25, 0, 76, 50, 10, 90, 60][i % 7],
    units: [
      {
        id: `u${i + 1}-1`,
        title: "Unit I: Foundations",
        lessons: [
          { id: `${i}-l1`, title: "Introduction and Course Overview", type: "pdf", done: true },
          { id: `${i}-l2`, title: "Core Concepts Walkthrough", type: "pdf", done: [25, 0, 76, 50, 10, 90, 60][i % 7] > 20 },
          { id: `${i}-l3`, title: "Worked Examples", type: "pdf", done: false },
          { id: `${i}-l4`, title: "Practice Problem Set", type: "doc", done: false }
        ]
      },
      {
        id: `u${i + 1}-2`,
        title: "Unit II: Applications",
        lessons: [
          { id: `${i}-l5`, title: "Case Study Discussion", type: "pdf", done: false },
          { id: `${i}-l6`, title: "Lab Reference Sheet", type: "doc", done: false }
        ]
      }
    ]
  }));
}

function buildGatepass(studentId) {
  const types = ["Weekend Pass", "Holiday Pass", "Working Day Pass"];
  const statuses = ["Approved", "Approved", "Completed", "Cancelled", "Approved", "Pending"];
  const reasons = ["Semester Break", "Study Holiday", "Family Function", "Medical", "Personal Work", ""];
  const passes = [];
  const baseDates = [
    ["2026-07-24T15:55", "2026-07-27T07:55"],
    ["2026-06-26T15:41", "2026-06-29T07:59"],
    ["2026-06-13T16:00", "2026-06-22T06:55"],
    ["2026-05-22T21:45", "2026-05-31T11:00"],
    ["2026-04-24T16:00", "2026-04-26T16:00"],
    ["2026-04-24T19:00", "2026-04-25T18:00"],
    ["2026-03-14T17:00", "2026-03-15T20:00"]
  ];
  baseDates.forEach((d, i) => {
    const status = pick(statuses, i);
    const approved = status !== "Pending" && status !== "Cancelled";
    passes.push({
      id: `${studentId}-pass${i + 1}`,
      studentId,
      type: pick(types, i),
      reason: pick(reasons, i),
      departure: d[0],
      return: d[1],
      status,
      approvals: {
        mentor: "Not Required",
        security: status === "Cancelled" ? "Pending" : "Approved",
        warden: status === "Cancelled" ? "Pending" : "Approved"
      }
    });
  });
  return passes;
}

function buildLibraryCatalog() {
  return [
    { id: "b1", title: "Principles of Digital Electronics", author: "R. Menon", available: true, copies: 3 },
    { id: "b2", title: "Signals, Systems and Transforms", author: "A. Krishnan", available: true, copies: 2 },
    { id: "b3", title: "Data Structures with Object Orientation", author: "S. Iyer", available: false, copies: 0 },
    { id: "b4", title: "Introduction to Operating Systems", author: "P. Raghavan", available: true, copies: 5 },
    { id: "b5", title: "Engineering Thermodynamics", author: "V. Subramaniam", available: true, copies: 1 },
    { id: "b6", title: "Design Thinking for Engineers", author: "N. Chandran", available: false, copies: 0 },
    { id: "b7", title: "Circuit Theory and Networks", author: "K. Bala", available: true, copies: 4 },
    { id: "b8", title: "Foundations of Machine Learning", author: "D. Vasan", available: true, copies: 2 }
  ];
}

function buildIssuedBooks(studentId) {
  return [
    { id: `${studentId}-issue1`, bookId: "b2", title: "Signals, Systems and Transforms", issuedOn: "2026-06-10", dueOn: "2026-07-24", returned: false },
    { id: `${studentId}-issue2`, bookId: "b7", title: "Circuit Theory and Networks", issuedOn: "2026-06-01", dueOn: "2026-06-30", returned: false }
  ];
}

function buildBusRoutes() {
  return [
    {
      id: "route1",
      name: "Route 1 - Tambaram",
      driver: "Driver A",
      stops: ["Tambaram", "Chromepet", "Pallavaram", "Campus Gate"],
      path: [
        [12.9249, 80.1000],
        [12.9516, 80.1462],
        [12.9675, 80.1491],
        [12.8406, 80.1534]
      ]
    },
    {
      id: "route2",
      name: "Route 2 - Velachery",
      driver: "Driver B",
      stops: ["Velachery", "Medavakkam", "Sholinganallur", "Campus Gate"],
      path: [
        [12.9756, 80.2207],
        [12.9186, 80.1953],
        [12.9010, 80.2279],
        [12.8406, 80.1534]
      ]
    },
    {
      id: "route3",
      name: "Route 3 - T. Nagar",
      driver: "Driver C",
      stops: ["T. Nagar", "Guindy", "St. Thomas Mount", "Campus Gate"],
      path: [
        [13.0418, 80.2341],
        [13.0067, 80.2206],
        [13.0067, 80.1958],
        [12.8406, 80.1534]
      ]
    }
  ];
}

function buildAttendance(studentId) {
  const subjects = ["Electronic Circuits", "OOPS and Data Structures", "Signals and Systems", "Design Thinking", "Operating Systems"];
  return subjects.map((s, i) => {
    const held = 30 + i * 2;
    const attended = Math.round(held * [0.92, 0.78, 0.68, 0.95, 0.83][i % 5]);
    return {
      id: `${studentId}-att${i + 1}`,
      subject: s,
      held,
      attended,
      percentage: Math.round((attended / held) * 1000) / 10
    };
  });
}

function buildMentors() {
  return [
    { id: "mentor1", name: "Dr. Faculty Name 1", department: "Electronics and Communication Engineering", slots: ["Mon 10:00", "Mon 14:00", "Wed 11:00"] },
    { id: "mentor2", name: "Dr. Faculty Name 2", department: "Computer Science and Engineering", slots: ["Tue 09:30", "Thu 15:00"] },
    { id: "mentor3", name: "Dr. Faculty Name 3", department: "Information Technology", slots: ["Fri 10:00", "Fri 13:00"] }
  ];
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
    { id: "evt2", title: "SSN Tech Symposium", college: "SSN College of Engineering", department: "Computer Science and Engineering", category: "Technical", mode: "Offline", venue: "SSN Main Auditorium", eventDate: "2026-07-30", registrationDeadline: "2026-07-27", description: "Paper presentations, coding contests and a project expo across CSE and IT streams." },
    { id: "evt3", title: "Riviera Cultural Fest", college: "VIT Vellore", department: "Cultural Committee", category: "Cultural", mode: "Offline", venue: "VIT Vellore Campus", eventDate: "2026-09-05", registrationDeadline: "2026-08-20", description: "One of the largest student-run cultural festivals with music, dance and design events." },
    { id: "evt4", title: "Techkriti Innovation Meet", college: "IIT Bombay", department: "Electronics and Communication", category: "Technical", mode: "Hybrid", venue: "IIT Bombay Campus, Mumbai", eventDate: "2026-08-22", registrationDeadline: "2026-08-10", description: "Startup showcases, hardware hackathons and innovation talks." },
    { id: "evt5", title: "Pragyan National Tech Fest", college: "NIT Tiruchirappalli", department: "Electrical and Electronics", category: "Technical", mode: "Offline", venue: "NIT Trichy Campus", eventDate: "2026-09-12", registrationDeadline: "2026-08-30", description: "National-level technical fest with workshops, competitions and guest lectures." },
    { id: "evt6", title: "Milan Cultural Carnival", college: "SRM Institute of Science and Technology", department: "Cultural Committee", category: "Cultural", mode: "Offline", venue: "SRM Kattankulathur Campus", eventDate: "2026-08-28", registrationDeadline: "2026-08-15", description: "Inter-college cultural carnival featuring music, dance, fashion and art competitions." },
    { id: "evt7", title: "SSN Design Thinking Studio Review", college: "SSN College of Engineering", department: "Common First Year", category: "Workshop", mode: "Offline", venue: "SSN Design Studio", eventDate: "2026-08-03", registrationDeadline: "2026-07-29", description: "Open studio review and workshop for the Design Thinking and Innovation course." },
    { id: "evt8", title: "Sathyabama National Sports Meet", college: "Sathyabama Institute of Science and Technology", department: "Sports Committee", category: "Sports", mode: "Offline", venue: "Sathyabama Sports Complex, Chennai", eventDate: "2026-09-18", registrationDeadline: "2026-09-01", description: "Inter-college athletics, badminton, chess and football tournaments." },
    { id: "evt9", title: "SSN Inter-Department Coding Sprint", college: "SSN College of Engineering", department: "Information Technology", category: "Technical", mode: "Online", venue: "Online (Codeforces-hosted)", eventDate: "2026-08-09", registrationDeadline: "2026-08-07", description: "A timed competitive programming sprint open to all departments." },
    { id: "evt10", title: "Kurukshetra Techno-Management Fest", college: "NIT Tiruchirappalli", department: "Management Studies", category: "Technical", mode: "Hybrid", venue: "NIT Trichy Campus", eventDate: "2026-09-25", registrationDeadline: "2026-09-10", description: "Techno-management fest with case study challenges and entrepreneurship talks." }
  ];
}

export async function initDb() {
  await db.read();
  if (!db.data || !db.data.users) {
    const students = buildStudents();
    db.data = {
      users: [...students, ...buildFaculty(), ...buildAdmins()],
      courses: buildCourses(),
      gatepass: students.flatMap((s) => buildGatepass(s.id)),
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
        timetable: [
          { date: "2026-08-10", subject: "Electronic Circuits", time: "10:00 AM - 01:00 PM", hall: "Hall A1", seat: "A-14" },
          { date: "2026-08-12", subject: "OOPS and Data Structures", time: "10:00 AM - 01:00 PM", hall: "Hall B2", seat: "B-07" },
          { date: "2026-08-14", subject: "Signals and Systems", time: "02:00 PM - 05:00 PM", hall: "Hall A1", seat: "A-14" }
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
            },
            {
              semester: "Semester 4",
              sgpa: 8.6,
              subjects: [
                { subject: "Design Thinking", grade: "A+" },
                { subject: "Operating Systems", grade: "A" }
              ]
            }
          ],
          cgpa: s.cgpa
        }))
      },
      helpdesk: {
        tickets: [
          { id: "tk1", studentId: "student1", category: "IT Services", subject: "Wi-Fi not connecting in hostel block C", description: "Unable to connect to campus Wi-Fi since yesterday evening.", status: "In Progress", createdAt: "2026-07-20", replies: [{ from: "support", text: "We are checking the access point in block C.", at: "2026-07-21" }] },
          { id: "tk2", studentId: "student1", category: "Academics", subject: "Gradesheet not verified", description: "My CAT1 gradesheet is still showing as unverified.", status: "Open", createdAt: "2026-07-23", replies: [] },
          { id: "tk3", studentId: "student2", category: "Facilities", subject: "AC not working in library reading room", description: "The reading room AC on the 2nd floor has not been working for two days.", status: "Resolved", createdAt: "2026-07-10", replies: [{ from: "support", text: "Technician has repaired the unit.", at: "2026-07-12" }] }
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
