import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import LocalLogin from "./components/LocalLogin";
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import CatMarks from "./pages/CatMarks";
import ExamTimetable from "./pages/ExamTimetable";
import ExamResults from "./pages/ExamResults";
import Stub from "./pages/Stub";

function Shell() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-slate-400">Loading…</div>;
  if (!user) return <LocalLogin />;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/upload-photo" element={<Stub title="Upload Your Photo" note="Photo upload is disabled in this generic prototype." />} />
          <Route path="/verify-gradesheet" element={<Stub title="Verify Gradesheet" />} />
          <Route path="/registered-subjects" element={<Stub title="Registered Subjects & Exam Fees Details" />} />
          <Route path="/cat-marks" element={<CatMarks />} />
          <Route path="/final-internal-marks" element={<Stub title="Final Internal Marks" />} />
          <Route path="/exam-timetable" element={<ExamTimetable />} />
          <Route path="/exam-results" element={<ExamResults />} />
          <Route path="/academic-report" element={<ExamResults />} />
          <Route path="/photocopy" element={<Stub title="Photocopy Request" />} />
          <Route path="/revaluation" element={<Stub title="Revaluation Request" />} />
          <Route path="/change-password" element={<Stub title="Change Password" />} />
        </Routes>
        <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">Part of SSN Unified</footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </HashRouter>
  );
}
