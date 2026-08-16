import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import LocalLogin from "./components/LocalLogin";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Mentorship from "./pages/Mentorship";
import FeePayment from "./pages/FeePayment";
import Academic from "./pages/Academic";
import Grievance from "./pages/Grievance";

function Shell() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-stone-500">Loading…</div>;
  if (!user) return <LocalLogin />;
  return (
    <div className="min-h-screen">
      <TopBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/fee-payment" element={<FeePayment />} />
        <Route path="/academic" element={<Academic />} />
        <Route path="/grievance" element={<Grievance />} />
      </Routes>
      <footer className="border-t border-wine-100 py-6 text-center text-xs text-stone-500">Part of SSN Unified</footer>
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
