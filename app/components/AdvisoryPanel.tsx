interface Props {
  analysis: any;
}

export default function AdvisoryPanel({
  analysis,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6">

      <h2 className="font-bold text-lg mb-6">
        Recommendations
      </h2>

      <div className="space-y-4">
        {analysis.warnings.map(
          (warning: string) => (
            <div
              key={warning}
              className="
                p-4
                rounded-xl
                bg-red-950
                border
                border-red-500
              "
            >
              {warning}
            </div>
          )
        )}
      </div>
    </div>
  );
}