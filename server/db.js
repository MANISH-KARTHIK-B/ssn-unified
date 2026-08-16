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

// Hostel warden account - approves gatepass requests after the mentor.
function buildWarden() {
  return [
    {
      id: "warden1",
      username: "warden1",
      password: "demo1234",
      role: "warden",
      name: "Mr. Hostel Warden",
      department: "Hostel Administration",
      email: "warden1@example-college.edu",
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
  return baseDates.map((d, i) =>
