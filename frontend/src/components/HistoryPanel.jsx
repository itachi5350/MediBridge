import UrgencyBadge from "./UrgencyBadge";

export default function HistoryPanel({ history, onSelect }) {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
        <span className="text-3xl block mb-2">📋</span>
        <p className="text-sm text-gray-400">Your previous queries will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🕐</span>
        <h3 className="font-semibold text-gray-800">Recent Queries</h3>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {history.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item)}
            className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-200 transition-all"
          >
            <p className="text-xs text-gray-500 mb-1">{item.timestamp}</p>
            <p className="text-sm text-gray-700 mb-2 truncate">{item.input}</p>
            <UrgencyBadge level={item.result.urgency_level} />
          </button>
        ))}
      </div>
    </div>
  );
}