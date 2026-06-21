interface Props {
  analysis: any;
}

export default function MetricCards({
  analysis,
}: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-slate-900 rounded-2xl p-6">
        <p className="text-slate-400 text-xs">
          GRAIN HEALTH INDEX
        </p>

        <h2 className="text-6xl font-black text-emerald-400">
          {analysis.score}
        </h2>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6">
        <p className="text-slate-400 text-xs">
          ESTIMATED LOSS
        </p>

        <h2 className="text-4xl font-black text-red-400">
          ₹{analysis.lossInr.toLocaleString()}
        </h2>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6">
        <p className="text-slate-400 text-xs">
          FUNGAL RISK
        </p>

        <h2 className="text-4xl font-black text-yellow-400">
          {analysis.risk}
        </h2>
      </div>

    </div>
  );
}