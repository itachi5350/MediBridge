export default function LanguageSelector({ selected, onSelect }) {
  const active = [
    { key: "hindi", name: "Hindi", native: "हिंदी" },
    { key: "kannada", name: "Kannada", native: "ಕನ್ನಡ" },
    { key: "tamil", name: "Tamil", native: "தமிழ்" },
    { key: "telugu", name: "Telugu", native: "తెలుగు" },
  ];

  const coming_soon = [
    { key: "bengali", name: "Bengali" },
    { key: "marathi", name: "Marathi" },
    { key: "gujarati", name: "Gujarati" },
    { key: "malayalam", name: "Malayalam" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🌐</span>
        <h3 className="font-semibold text-gray-800">Select Language</h3>
      </div>

      <div className="flex flex-col gap-2 mb-5">
        {active.map((lang) => (
          <button
            key={lang.key}
            onClick={() => onSelect(lang.key)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all
              ${selected === lang.key
                ? "bg-teal-500 text-white border-teal-500 shadow-md"
                : "bg-gray-50 text-gray-700 border-gray-100 hover:border-teal-300 hover:bg-teal-50"
              }`}
          >
            <span className={`text-lg font-medium ${selected === lang.key ? "text-white" : "text-teal-600"}`}>
              {lang.native}
            </span>
            <span className={`text-sm ${selected === lang.key ? "text-teal-100" : "text-gray-500"}`}>
              {lang.name}
            </span>
            {selected === lang.key && <span className="ml-auto">✓</span>}
          </button>
        ))}
      </div>

    <div className="border-t pt-4">
  <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Coming Soon</p>
  <div className="flex flex-wrap gap-2">
    {coming_soon.map((lang) => (
      <span
        key={lang.key}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 border border-gray-300 bg-gray-100"
      >
        {lang.name}
      </span>
    ))}
  </div>
</div>
    </div>
  );
}