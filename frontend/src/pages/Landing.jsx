export default function Landing({ onStart }) {
  const letters = "MEDIBRIDGE".split("");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(13,148,136,0.95) 0%, rgba(6,182,212,0.90) 100%)",
      }}
    >
      {/* Medical cross background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-rule='evenodd'%3E%3Cpath d='M25 10h10v15h15v10H35v15H25V35H10V25h15z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Soft depth circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-teal-300 rounded-full opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-300 rounded-full opacity-20 blur-3xl pointer-events-none" />

      <div className="relative text-center mb-12">

        {/* Title with enlarged M and E */}
        <div
          className="letter-hover select-none cursor-default flex items-end justify-center mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, color: "white" }}
        >
          {letters.map((letter, i) => {
            const isFirst = i === 0;
            const isLast = i === letters.length - 1;
            return (
              <span
                key={i}
                style={{
                  fontSize: isFirst || isLast ? "7rem" : "4.5rem",
                  lineHeight: 1,
                  display: "inline-block",
                  transition: "transform 0.15s ease",
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>

        <p className="font-kabel text-teal-100 text-xl mb-5">
          Health guidance in your language
        </p>

        <p className="text-white text-sm max-w-md mx-auto leading-relaxed italic font-medium opacity-90">
          "Get reliable health guidance and wellness tips in your preferred language.
          Ask questions, receive personalized recommendations, and manage your health with ease."
        </p>
      </div>

      <button
        onClick={onStart}
        className="relative z-10 bg-white text-teal-600 font-bold px-10 py-4 rounded-full text-lg
                   hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
      >
        Let's Start
      </button>

      <div className="relative mt-16 flex gap-12 text-center">
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