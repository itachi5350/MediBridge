import { useState, useEffect, useRef } from "react";
import LanguageSelector from "../components/LanguageSelector";
import TextInput from "../components/TextInput";
import ResultCard from "../components/ResultCard";
import HistoryPanel from "../components/HistoryPanel";
import NearbyHospitals from "../components/NearbyHositals";
import { analyzeSymptoms, saveToHistory, fetchHistory } from "../api/medibridge";

function getSessionId() {
  let id = localStorage.getItem("medibridge_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("medibridge_session", id);
  }
  return id;
}

export default function Dashboard({ onBack, onProfile, onReportReader, onLanguageChange }) {
  const [language, setLanguage] = useState("hindi");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const sessionId = useRef(getSessionId());
  const recognitionRef = useRef(null);

  const speechCodes = {
    hindi: "hi-IN",
    kannada: "kn-IN",
    tamil: "ta-IN",
    telugu: "te-IN",
    malayalam: "ml-IN",
    marathi: "mr-IN",
  };

  useEffect(() => {
    fetchHistory(sessionId.current)
      .then((data) => { if (data.success) setHistory(data.history); })
      .catch(() => {});
  }, []);

  function handleLanguageChange(lang) {
    setLanguage(lang);
    if (onLanguageChange) onLanguageChange(lang);
  }

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeSymptoms(text, language);
      if (data.success) {
        setResult(data.result);
        await saveToHistory(sessionId.current, language, text, data.result);
        setHistory((prev) => [
          { input: text, result: data.result, language, timestamp: new Date().toLocaleTimeString() },
          ...prev.slice(0, 9),
        ]);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setText("");
    setResult(null);
    setError(null);
  }

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Use Chrome for voice input."); return; }
    const recognition = new SR();
    recognition.lang = speechCodes[language] || "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript;
      setText(transcript);
      setListening(false);
    };

    recognition.onerror = (e) => {
      setListening(false);
      if (e.error === "no-speech") alert("No speech detected. Please try again.");
      else if (e.error === "not-allowed") alert("Microphone access denied. Please allow microphone in browser settings.");
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          <div>
            <h1 className="font-bold text-teal-600 text-xl tracking-wide">MEDIBRIDGE</h1>
            <p className="text-xs text-gray-500 font-semibold">Health guidance in your language</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReportReader}
              className="text-sm font-bold text-teal-600 border border-teal-200 px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors"
            >
              Read My Report
            </button>
            <button
              onClick={onProfile}
              className="text-sm font-bold text-teal-600 border border-teal-200 px-4 py-2 rounded-xl hover:bg-teal-50 transition-colors"
            >
              My Profile
            </button>
            <button
              onClick={onBack}
              className="text-sm font-bold text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:text-teal-600 hover:border-teal-200 transition-colors"
            >
              Back to home
            </button>
          </div>

        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Describe your symptoms</h2>
              <TextInput value={text} onChange={setText} disabled={loading} />

              {/* Mic button */}
              <button
                onClick={listening ? stopVoice : startVoice}
                className={`mt-3 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${listening
                    ? "bg-red-500 border-red-500 animate-pulse"
                    : "bg-white border-gray-200 hover:border-teal-400 hover:bg-teal-50"
                  }`}
                title={listening ? "Stop listening" : "Speak instead"}
              >
                {listening ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10a7 7 0 0 1-14 0" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
              </button>

              {error && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-bold">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !text.trim()}
                  className="flex-1 bg-teal-500 text-white rounded-xl py-3 font-bold
                             hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing..." : "Get Guidance"}
                </button>
                {(result || error) && (
                  <button
                    onClick={handleReset}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <ResultCard result={result} input={text} language={language} />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <LanguageSelector selected={language} onSelect={handleLanguageChange} />
            <NearbyHospitals />
            <HistoryPanel history={history} onSelect={(item) => setResult(item.result)} />
          </div>

        </div>
      </div>

    </div>
  );
}