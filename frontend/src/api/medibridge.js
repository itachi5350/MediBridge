const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export async function fetchLanguages() {
  const res = await fetch(`${API_BASE}/languages`);
  if (!res.ok) throw new Error("Failed to fetch languages");
  return res.json();
}

export async function analyzeSymptoms(text, language) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}