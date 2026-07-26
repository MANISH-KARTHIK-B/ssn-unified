import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import LocalLogin from "./components/LocalLogin";
import Nav from "./components/Nav";
import MyCourses from "./pages/MyCourses";
import CourseContent from "./pages/CourseContent";

function Shell() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-graphite-500">Loading…</div>;
  if (!user) return <LocalLogin />;
  return (
    <div className="min-h-screen">
      <Nav />
      <Routes>
        <Route path="/" element={<MyCourses />} />
        <Route path="/course/:id" element={<CourseContent />} />
      </Routes>
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-graphite-500">Part of SSN Unified</footer>
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
