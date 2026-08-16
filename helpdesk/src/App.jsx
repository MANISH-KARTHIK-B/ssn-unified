import React from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import LocalLogin from "./components/LocalLogin";
import Tickets from "./pages/Tickets";
import FacultyTickets from "./pages/FacultyTickets";

function Shell() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-char-500">Loading…</div>;
  if (!user) return <LocalLogin />;
  return (
    <div className="min-h-screen">
      {user.role === "faculty" ? <FacultyTickets /> : <Tickets />}
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-char-500">Part of SSN Unified</footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
