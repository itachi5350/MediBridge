import { useState, useRef } from "react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import HealthProfile from "./pages/HealthProfile";
import ReportReader from "./pages/ReportReader";

function getSessionId() {
  let id = localStorage.getItem("medibridge_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("medibridge_session", id);
  }
  return id;
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [language, setLanguage] = useState("hindi");
  const sessionId = useRef(getSessionId());

  const pages = {
    landing: (
      <Landing onStart={() => setPage("dashboard")} />
    ),
    dashboard: (
      <Dashboard
        onBack={() => setPage("landing")}
        onProfile={() => setPage("profile")}
        onReportReader={() => setPage("report")}
        onLanguageChange={setLanguage}
      />
    ),
    profile: (
      <HealthProfile
        sessionId={sessionId.current}
        onBack={() => setPage("dashboard")}
      />
    ),
    report: (
      <ReportReader
        onBack={() => setPage("dashboard")}
        language={language}
      />
    ),
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {pages[page]}
    </div>
  );
}