interface Props {
  analysis: any;
}

export default function ReportPanel({
  analysis,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6">

      <h2 className="font-bold text-xl">
        Report Compiler
      </h2>

      <button
        className="
          mt-6
          bg-emerald-400
          text-black
          px-6
          py-3
          rounded-xl
          font-bold
        "
      >
        Export PDF
      </button>
    </div>
  );
}