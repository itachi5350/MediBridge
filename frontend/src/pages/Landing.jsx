export default function Landing({ onStart }) {
  const letters = "MEDIBRIDGE".split("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-400 flex flex-col items-center justify-center px-4">

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-8 shadow-lg">
          <span className="text-4xl">🏥</span>
        </div>

        <h1 className="font-playfair text-7xl font-black text-white mb-4 letter-hover select-none cursor-default">
          {letters.map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </h1>

        <p className="font-kabel text-teal-100 text-xl mb-4">
          Health guidance in your language
        </p>

        <p className="text-white text-sm max-w-md mx-auto leading-relaxed italic font-medium opacity-90">
          "Get reliable health guidance and wellness tips in your preferred language. Ask questions, receive personalized recommendations, and manage your health with ease."
        </p>
      </div>

      <button
        onClick={onStart}
        className="bg-white text-teal-600 font-bold px-10 py-4 rounded-full text-lg
                   hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
      >
        Let's Start →
      </button>

      <div className="mt-16 flex gap-12 text-center">
        {[
          { emoji: "🔒", label: "Safe & Private" },
          { emoji: "⚡", label: "Instant Guidance" },
        ].map((item) => (
          <div key={item.label}>
            <div className="text-2xl mb-1">{item.emoji}</div>
            <div className="text-teal-100 text-sm font-semibold">{item.label}</div>
          </div>
        ))}
      </div>

    </div>
  );
}