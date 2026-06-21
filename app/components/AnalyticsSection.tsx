export default function AnalyticsSection() {
  return (
    <section
      className="
      grid
      lg:grid-cols-2
      gap-8
    "
    >
      <div
        className="
        h-80
        rounded-3xl
        bg-slate-900/70
        p-8
      "
      >
        GHI Trend Chart
      </div>

      <div
        className="
        h-80
        rounded-3xl
        bg-slate-900/70
        p-8
      "
      >
        Loss Trend Chart
      </div>
    </section>
  );
}
