const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export async function analyzeSymptoms(text, language) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}

export async function saveToHistory(sessionId, language, input, result) {
  await fetch(`${API_BASE}/history/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, language, input, result }),
  });
}

export async function fetchHistory(sessionId) {
  const res = await fetch(`${API_BASE}/history/${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function fetchProfile(sessionId) {
  const res = await fetch(`${API_BASE}/profile/${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}