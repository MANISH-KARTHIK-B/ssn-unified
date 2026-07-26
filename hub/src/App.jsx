import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import BusTracker from "./pages/BusTracker";
import Attendance from "./pages/Attendance";
import Mess from "./pages/Mess";
import Mentors from "./pages/Mentors";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-navy-950 text-navy-500">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen bg-navy-950">
      <Nav />
      {children}
      <footer className="border-t border-navy-800 py-6 text-center text-xs text-navy-600">
        Part of SSN Unified — a modernized student portal prototype
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Landing /></Protected>} />
          <Route path="/bus-tracker" element={<Protected><BusTracker /></Protected>} />
          <Route path="/attendance" element={<Protected><Attendance /></Protected>} />
          <Route path="/mess" element={<Protected><Mess /></Protected>} />
          <Route path="/mentors" element={<Protected><Mentors /></Protected>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
