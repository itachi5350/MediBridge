import UrgencyBadge from "./UrgencyBadge";

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">

      {/* Top banner */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-400 px-6 py-4">
        <div className="flex items-center gap-2 text-white mb-1">
          <span className="text-xl">🩺</span>
          <span className="font-semibold">Analysis Complete</span>
        </div>
        <UrgencyBadge level={result.urgency_level} />
      </div>

      <div className="p-6 space-y-5">

        <div className="flex gap-3">
          <span className="text-2xl">👂</span>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">We understood</p>
            <p className="text-gray-800 text-sm">{result.understood_symptom}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">What this could mean</p>
            <p className="text-gray-800 text-sm">{result.plain_explanation}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">What to do</p>
            <p className="text-gray-800 text-sm">{result.recommended_action}</p>
          </div>
        </div>

        <div className="bg-teal-50 rounded-xl p-4 flex gap-3">
          <span className="text-2xl">🗣️</span>
          <div>
            <p className="text-xs font-medium text-teal-600 uppercase tracking-wide mb-1">Response in your language</p>
            <p className="text-teal-800 text-sm leading-relaxed">{result.response_in_user_language}</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 border-t pt-4 flex gap-2">
          <span>⚕️</span>
          {result.disclaimer}
        </p>

      </div>
    </div>
  );
}