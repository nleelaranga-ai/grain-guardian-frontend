export default function TelemetryGauges() {
  return (
    <section
      className="
      rounded-3xl
      bg-slate-900/70
      p-8
      space-y-6
    "
    >
      <h2 className="text-2xl font-bold">
        Live Telemetry
      </h2>

      <div className="grid grid-cols-3 gap-6">

        <div className="text-center">
          <div className="text-5xl font-black text-cyan-400">
            34°
          </div>

          <p className="text-slate-400">
            Temperature
          </p>
        </div>

        <div className="text-center">
          <div className="text-5xl font-black text-emerald-400">
            65%
          </div>

          <p className="text-slate-400">
            Humidity
          </p>
        </div>

        <div className="text-center">
          <div className="text-5xl font-black text-yellow-400">
            14%
          </div>

          <p className="text-slate-400">
            Moisture
          </p>
        </div>

      </div>
    </section>
  );
}
