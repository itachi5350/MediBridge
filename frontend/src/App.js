import { useState } from "react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("landing");

  return page === "landing"
    ? <Landing onStart={() => setPage("dashboard")} />
    : <Dashboard onBack={() => setPage("landing")} />;
}