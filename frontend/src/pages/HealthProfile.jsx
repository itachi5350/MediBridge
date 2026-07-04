import { useState, useEffect } from "react";
import { fetchProfile } from "../api/medibridge";
import UrgencyBadge from "../components/UrgencyBadge";

export default function HealthProfile({ sessionId, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile(sessionId)
      .then((data) => { if (data.success) setProfile(data.profile); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">📋</span>
        <p className="text-gray-500 font-medium">No health data yet.</p>
        <p className="text-gray-400 text-sm">Make a few queries first to build your profile.</p>
        <button
          onClick={onBack}
          className="mt-2 text-sm font-bold text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:text-teal-600 hover:border-teal-200 transition-colors"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const total = profile.total_queries;
  const { low, moderate, high } = profile.urgency_breakdown;

  function pct(val) {
    return total > 0 ? Math.round((val / total) * 100) : 0;
  }

  const languageDisplay = {
    hindi: "Hindi",
    kannada: "Kannada",
    tamil: "Tamil",
    telugu: "Telugu",
    marathi: "Marathi",
    malayalam: "Malayalam",
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-bold text-teal-600 text-xl tracking-wide">MEDIBRIDGE</h1>
          <button
            onClick={onBack}
            className="text-sm font-bold text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:text-teal-600 hover:border-teal-200 transition-colors"
          >
            Back to dashboard
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Profile header */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-400 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow">
              <span
                className="font-bold text-teal-600"
                style={{ fontSize: "2rem", fontFamily: "serif" }}
              >
                अ
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Your Health Profile</h2>
              <p className="text-teal-100 text-sm font-medium">
                Based on {total} {total === 1 ? "query" : "queries"} — Preferred language: {languageDisplay[profile.most_used_language] || profile.most_used_language}
              </p>
              {profile.last_query && (
                <p className="text-teal-200 text-xs mt-1">
                  Last active: {new Date(profile.last_query).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Queries", value: total },
            { label: "Most Used Language", value: languageDisplay[profile.most_used_language] || profile.most_used_language },
            { label: "High Urgency Cases", value: high },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs font-semibold text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Urgency breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-5">Urgency Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: "Low", value: low, pct: pct(low), color: "bg-green-500", text: "text-green-700" },
              { label: "Moderate", value: moderate, pct: pct(moderate), color: "bg-yellow-400", text: "text-yellow-700" },
              { label: "High", value: high, pct: pct(high), color: "bg-red-500", text: "text-red-700" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between mb-1">
                  <span className={"text-sm font-bold " + row.text}>{row.label} urgency</span>
                  <span className="text-sm font-bold text-gray-500">{row.value} queries ({row.pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={row.color + " h-3 rounded-full transition-all duration-700"}
                    style={{ width: row.pct + "%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top symptoms */}
        {profile.top_symptoms && profile.top_symptoms.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Most Searched Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {profile.top_symptoms.map((word) => (
                <span
                  key={word}
                  className="bg-teal-50 text-teal-700 font-semibold text-sm px-4 py-2 rounded-full border border-teal-200"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent queries */}
        {profile.recent && profile.recent.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Recent Queries</h3>
            <div className="space-y-3">
              {profile.recent.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">{item.input}</p>
                    <p className="text-xs text-gray-400 font-medium">{item.timestamp}</p>
                  </div>
                  <UrgencyBadge level={item.result.urgency_level} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}