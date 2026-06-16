export default function UrgencyBadge({ level }) {
  const config = {
    low: {
      label: "Low Urgency",
      emoji: "✅",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      desc: "Home care should be fine"
    },
    moderate: {
      label: "Moderate Urgency",
      emoji: "⚠️",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      desc: "See a doctor soon"
    },
    high: {
      label: "High Urgency",
      emoji: "🚨",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      desc: "Seek help today"
    },
  };

  const c = config[level] || config.low;

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border ${c.bg} ${c.border}`}>
      <span className="text-xl">{c.emoji}</span>
      <div>
        <p className={`font-semibold text-sm ${c.text}`}>{c.label}</p>
        <p className={`text-xs ${c.text} opacity-75`}>{c.desc}</p>
      </div>
    </div>
  );
}