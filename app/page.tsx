"use client";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-black text-emerald-400">
              GRAIN GUARDIAN
            </h1>

            <p className="text-xs text-slate-400">
              Decision Intelligence V3
            </p>
          </div>

          <div className="flex gap-3">

            <div className="px-4 py-2 rounded-xl bg-slate-900">
              🌐 Telugu
            </div>

            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              ● SAFE
            </div>

          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">

        {/* HERO */}
        <section className="text-center space-y-8">

          <span className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
            PREMIUM GRAIN DIAGNOSTICS
          </span>

          <h1 className="text-6xl lg:text-7xl font-black">
            Built for clarity.
            <br />
            Designed for action.
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 text-lg">
            AI-powered post-harvest intelligence
            platform combining sensor telemetry,
            fungal prediction and economic loss
            analytics.
          </p>

        </section>

        {/* KPI CARDS */}
        <section className="grid md:grid-cols-3 gap-6">

          <div className="glass-card card-hover rounded-3xl p-8">
            <p className="text-slate-400 text-sm">
              GRAIN HEALTH INDEX
            </p>

            <h2 className="text-6xl font-black text-emerald-400 mt-4">
              92
            </h2>

            <p className="text-slate-500 mt-2">
              /100
            </p>
          </div>

          <div className="glass-card card-hover rounded-3xl p-8">
            <p className="text-slate-400 text-sm">
              ESTIMATED LOSS
            </p>

            <h2 className="text-5xl font-black text-red-400 mt-4">
              ₹12,540
            </h2>
          </div>

          <div className="glass-card card-hover rounded-3xl p-8">
            <p className="text-slate-400 text-sm">
              FUNGAL RISK
            </p>

            <h2 className="text-5xl font-black text-yellow-400 mt-4">
              LOW
            </h2>
          </div>

        </section>

        {/* TELEMETRY + RECOMMENDATIONS */}
        <section className="grid lg:grid-cols-2 gap-8">

          <div className="glass-card rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-8">
              Probe Telemetry
            </h2>

            <div className="space-y-6">

              <div>
                <div className="flex justify-between mb-2">
                  <span>Temperature</span>
                  <span>34°C</span>
                </div>

                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div className="w-[65%] h-full bg-cyan-400"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Humidity</span>
                  <span>65%</span>
                </div>

                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div className="w-[70%] h-full bg-emerald-400"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Moisture</span>
                  <span>14%</span>
                </div>

                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div className="w-[45%] h-full bg-yellow-400"></div>
                </div>
              </div>

            </div>

          </div>

          <div className="glass-card rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-8">
              Recommendations
            </h2>

            <div className="space-y-4">

              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
                🔴 Moisture exceeds threshold.
              </div>

              <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                🟡 Internal thermal hotspot developing.
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                🟢 Storage environment stable.
              </div>

            </div>

          </div>

        </section>

        {/* CLP */}
        <section>

          <h2 className="text-3xl font-bold mb-6">
            Critical Loss Point Matrix
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">

            {[
              "CLP-1",
              "CLP-2",
              "CLP-3",
              "CLP-4",
              "CLP-5",
            ].map((item) => (
              <div
                key={item}
                className="glass-card rounded-3xl p-6 text-center"
              >
                <h3 className="font-bold text-lg">
                  {item}
                </h3>

                <p className="text-slate-400 mt-3">
                  Monitoring Active
                </p>
              </div>
            ))}

          </div>

        </section>

        {/* HISTORY */}
        <section className="glass-card rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-8">
            Historic Ledger
          </h2>

          <div className="space-y-6">

            <div className="border-l-2 border-emerald-400 pl-6">
              <h3 className="font-bold">
                June 02
              </h3>

              <p className="text-slate-400">
                Paddy Analysis Completed
              </p>
            </div>

            <div className="border-l-2 border-cyan-400 pl-6">
              <h3 className="font-bold">
                June 10
              </h3>

              <p className="text-slate-400">
                Inter-Drying Phase Recorded
              </p>
            </div>

          </div>

        </section>

        {/* REPORT */}
        <section className="glass-card rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-8">
            Report Compiler
          </h2>

          <button className="bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-2xl">
            Export PDF
          </button>

        </section>

      </main>
    </div>
  );
}
