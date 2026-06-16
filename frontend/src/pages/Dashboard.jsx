import { useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import TextInput from "../components/TextInput";
import ResultCard from "../components/ResultCard";
import HistoryPanel from "../components/HistoryPanel";
import { analyzeSymptoms } from "../api/medibridge";

export default function Dashboard({ onBack }) {
  const [language, setLanguage] = useState("hindi");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeSymptoms(text, language);
      if (data.success) {
        setResult(data.result);
        setHistory((prev) => [
          {
            input: text,
            result: data.result,
            language,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 9),
        ]);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
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

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏥</span>
            <div>
              <h1 className="font-bold text-teal-600 text-xl tracking-wide">MEDIBRIDGE</h1>
              <p className="font-kabel text-xs text-gray-500 font-semibold">Health guidance in your language</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-sm font-bold text-gray-600 hover:text-teal-600 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-semibold text-gray-800 text-lg">Describe your symptoms</h2>
              </div>
              <TextInput value={text} onChange={setText} disabled={loading} />

              {error && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !text.trim()}
                  className="flex-1 bg-teal-500 text-white rounded-xl py-3 font-medium
                             hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing..." : "Get Guidance"}
                </button>
                {(result || error) && (
                  <button
                    onClick={handleReset}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <ResultCard result={result} />
          </div>

          <div className="space-y-4">
            <LanguageSelector selected={language} onSelect={setLanguage} />
            <HistoryPanel history={history} onSelect={(item) => setResult(item.result)} />
          </div>

        </div>
      </div>
    </div>
  );
}