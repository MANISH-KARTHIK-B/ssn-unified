import React from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import LocalLogin from "./components/LocalLogin";
import Sidebar from "./components/Sidebar";
import PassRequests from "./pages/PassRequests";
import WardenDashboard from "./pages/WardenDashboard";
import MentorApprovals from "./pages/MentorApprovals";

function Shell() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-ink-500">Loading…</div>;
  if (!user) return <LocalLogin />;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {user.role === "warden" ? (
        <WardenDashboard />
      ) : user.role === "faculty" ? (
        <MentorApprovals />
      ) : (
        <PassRequests />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
      <div className="pointer-events-none fixed bottom-3 right-4 text-[11px] text-ink-500/70">Part of SSN Unified</div>
    </AuthProvider>
  );
}
