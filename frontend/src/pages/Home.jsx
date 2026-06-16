import { useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import TextInput from "../components/TextInput";
import ResultCard from "../components/ResultCard";

const DUMMY_RESULT = {
  urgency_level: "moderate",
  understood_symptom: "Mild headache with fever for 2 days",
  plain_explanation: "This could be a common viral infection like a cold or flu. Fever with headache is usually the body fighting an infection.",
  recommended_action: "Rest and stay hydrated. Visit a doctor if fever goes above 101°F or symptoms worsen after 2 days.",
  response_in_user_language: "आपको हल्का बुखार और सिरदर्द है। यह सामान्य वायरल संक्रमण हो सकता है। आराम करें और पानी पिएं।",
  disclaimer: "This is not a medical diagnosis. Please consult a qualified doctor for proper medical advice.",
};

export default function Home() {
  const [language, setLanguage] = useState("hindi");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    // Simulate API delay with dummy data for now
    setTimeout(() => {
      setResult(DUMMY_RESULT);
      setLoading(false);
    }, 1500);
  }

  function handleReset() {
    setText("");
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">MediBridge</h1>
          <p className="text-sm text-gray-500 mt-1">Health guidance in your language</p>
        </div>

        {/* Language selector */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-4">
          <LanguageSelector selected={language} onSelect={setLanguage} />
        </div>

        {/* Text input */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-4">
          <p className="text-sm text-gray-500 mb-2">Describe your symptoms</p>
          <TextInput value={text} onChange={setText} disabled={loading} />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-medium
                     hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Get Guidance"}
        </button>

        {/* Result */}
        <ResultCard result={result} />

        {/* Reset */}
        {result && (
          <button
            onClick={handleReset}
            className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600"
          >
            Start over
          </button>
        )}

      </div>
    </div>
  );
}