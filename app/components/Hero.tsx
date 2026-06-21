export default function Hero() {
  return (
    <section
      className="
      py-16
      text-center
      space-y-8
    "
    >
      <span
        className="
        inline-block
        px-4 py-2
        rounded-full
        bg-emerald-500/10
        text-emerald-400
      "
      >
        PREMIUM GRAIN DIAGNOSTICS
      </span>

      <h1
        className="
        text-6xl
        lg:text-7xl
        font-black
      "
      >
        Built for clarity.
        <br />
        Designed for action.
      </h1>

      <p
        className="
        max-w-3xl
        mx-auto
        text-slate-400
        text-lg
      "
      >
        AI-powered post-harvest
        decision intelligence platform
        combining sensor telemetry,
        fungal prediction,
        and economic loss analytics.
      </p>

      <div
        className="
        flex
        justify-center
        gap-4
      "
      >
        <button
          className="
          px-6 py-3
          rounded-2xl
          bg-emerald-400
          text-slate-950
          font-bold
        "
        >
          Run Analysis
        </button>

        <button
          className="
          px-6 py-3
          rounded-2xl
          bg-slate-900
          border
          border-white/10
        "
        >
          Generate Report
        </button>
      </div>
    </section>
  );
}
