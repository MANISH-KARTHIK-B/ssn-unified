import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { FacultyProvider } from "./lib/facultyContext";
import LocalLogin from "./components/LocalLogin";
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import CatMarks from "./pages/CatMarks";
import InternalMarks from "./pages/InternalMarks";
import RegisteredSubjects from "./pages/RegisteredSubjects";
import VerifyGradesheet from "./pages/VerifyGradesheet";
import ExamTimetable from "./pages/ExamTimetable";
import ExamResults from "./pages/ExamResults";
import UploadPhoto from "./pages/UploadPhoto";
import ChangePassword from "./pages/ChangePassword";
import PhotocopyRevaluation from "./pages/PhotocopyRevaluation"; 

function Shell() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-slate-400">Loading…</div>;
  if (!user) return <LocalLogin />;
  return (
    <FacultyProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/upload-photo" element={<UploadPhoto />} />
            <Route path="/verify-gradesheet" element={<VerifyGradesheet />} />
            <Route path="/registered-subjects" element={<RegisteredSubjects />} />
            <Route path="/cat-marks" element={<CatMarks />} />
            <Route path="/final-internal-marks" element={<InternalMarks />} />
            <Route path="/exam-timetable" element={<ExamTimetable />} />
            <Route path="/exam-results" element={<ExamResults />} />
            <Route path="/academic-report" element={<ExamResults />} />
            <Route path="/photocopy" element={<PhotocopyRevaluation type="Photocopy" />} />
            <Route path="/revaluation" element={<PhotocopyRevaluation type="Revaluation" />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
          <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">Part of SSN Unified</footer>
        </main>
      </div>
    </FacultyProvider>
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
