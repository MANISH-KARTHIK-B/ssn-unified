import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import LocalLogin from "./components/LocalLogin";
import Sidebar from "./components/Sidebar";
import Fees from "./pages/Fees";
import Documents from "./pages/Documents";
import Hostel from "./pages/Hostel";

function Shell() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-stone-500">Loading…</div>;
  if (!user) return <LocalLogin />;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Fees />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/hostel" element={<Hostel />} />
        </Routes>
        <footer className="border-t border-wine-100 py-6 text-center text-xs text-stone-500">Part of SSN Unified</footer>
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
