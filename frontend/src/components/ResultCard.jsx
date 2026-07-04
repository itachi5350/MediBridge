import UrgencyBadge from "./UrgencyBadge";
import EmergencyBanner from "./EmergencyBanner";
import { exportToPDF } from "../utils/pdfExport";

export default function ResultCard({ result, input, language }) {
  if (!result) return null;

  return (
    <div className="mt-4">

      {result.urgency_level === "high" && <EmergencyBanner />}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="bg-gradient-to-r from-teal-500 to-cyan-400 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white mb-2">
              <span className="font-bold text-lg">Analysis Complete</span>
            </div>
            <button
              onClick={() => exportToPDF(result, input, language)}
              className="bg-white text-teal-600 font-bold text-xs px-3 py-2 rounded-xl hover:bg-teal-50 transition-colors"
            >
              Download Report
            </button>
          </div>
          <UrgencyBadge level={result.urgency_level} />
        </div>

        <div className="p-6 space-y-5">

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">We understood</p>
            <div className="w-full h-px bg-gray-100 mb-2" />
            <p className="text-gray-800 text-sm font-medium">{result.understood_symptom}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">What this could mean</p>
            <div className="w-full h-px bg-gray-100 mb-2" />
            <p className="text-gray-800 text-sm">{result.plain_explanation}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">What to do</p>
            <div className="w-full h-px bg-gray-100 mb-2" />
            <p className="text-gray-800 text-sm font-medium">{result.recommended_action}</p>
          </div>
          {result.home_care && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Home care steps</p>
              <div className="w-full h-px bg-gray-100 mb-2" />
              <p className="text-gray-800 text-sm">{result.home_care}</p>
            </div>
          )}

          {result.when_to_escalate && (
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">
                When to seek immediate help
              </p>
              <p className="text-orange-800 text-sm">{result.when_to_escalate}</p>
            </div>
          )}
          <div className="bg-teal-50 rounded-xl p-4">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-1">Response in your language</p>
            <p className="text-teal-800 text-sm leading-relaxed">{result.response_in_user_language}</p>
          </div>
          <a
            href={"https://wa.me/?text=" + encodeURIComponent(
              "MediBridge Health Report\n\n" +
              "Symptoms: " + input + "\n" +
              "Urgency: " + (result.urgency_level || "").toUpperCase() + "\n" +
              "Summary: " + result.plain_explanation + "\n" +
              "Action: " + result.recommended_action + "\n\n" +
              result.disclaimer
            )}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            Share on WhatsApp
          </a>

          <p className="text-xs text-gray-400 border-t pt-4">
            {result.disclaimer}
          </p>

        </div>
      </div>
    </div>
  );
}