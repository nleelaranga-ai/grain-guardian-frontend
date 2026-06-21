interface Props {
  analysis: any;
}

export default function CLPGrid({
  analysis,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      {analysis.clps.map((clp: any) => (
        <div
          key={clp.id}
          className="
            bg-slate-900
            rounded-2xl
            p-6
          "
        >
          <h3 className="font-bold">
            {clp.title}
          </h3>

          <p className="text-slate-400 mt-2">
            {clp.description}
          </p>

          <p className="mt-6 text-emerald-400">
            {clp.value}
          </p>
        </div>
      ))}

    </div>
  );
}