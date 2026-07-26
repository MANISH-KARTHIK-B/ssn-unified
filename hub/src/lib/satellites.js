// Each satellite's URL comes from a Vite env var (set in Render's dashboard for production
// deploys) and falls back to the local dev port so `npm run dev` still works unmodified.
export const SATELLITES = [
  {
    id: "coe",
    name: "COE",
    fullName: "Controller of Examinations",
    description: "Gradesheets, CAT marks, exam timetable & results",
    url: import.meta.env.VITE_COE_URL || "http://localhost:5174/",
    icon: "GraduationCap",
    accent: "#1C2541"
  },
  {
    id: "lms",
    name: "LMS",
    fullName: "Learning Management System",
    description: "Courses, lessons and study material",
    url: import.meta.env.VITE_LMS_URL || "http://localhost:5175/",
    icon: "BookOpen",
    accent: "#5B4EE5"
  },
  {
    id: "library",
    name: "Library",
    fullName: "Central Library OPAC",
    description: "Catalog search, issued books & fines",
    url: import.meta.env.VITE_LIBRARY_URL || "http://localhost:5176/",
    icon: "Library",
    accent: "#0F5E9C"
  },
  {
    id: "gatepass",
    name: "Gatepass",
    fullName: "Outing & Leave Pass",
    description: "Request and track weekend/holiday passes",
    url: import.meta.env.VITE_GATEPASS_URL || "http://localhost:5177/",
    icon: "DoorOpen",
    accent: "#1F7A5C"
  },
  {
    id: "helpdesk",
    name: "Helpdesk",
    fullName: "Student Helpdesk",
    description: "Raise and track support tickets",
    url: import.meta.env.VITE_HELPDESK_URL || "http://localhost:5178/",
    icon: "LifeBuoy",
    accent: "#B54708"
  },
  {
    id: "erp",
    name: "ERP",
    fullName: "Enterprise Resource Planning",
    description: "Fees, document requests & hostel info",
    url: import.meta.env.VITE_ERP_URL || "http://localhost:5179/",
    icon: "Landmark",
    accent: "#7A1F3D"
  }
];
