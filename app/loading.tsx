export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">

      <div className="flex flex-col items-center gap-6">

        <div
          className="
            h-20
            w-20
            rounded-full
            border-4
            border-emerald-400
            border-t-transparent
            animate-spin
          "
        />

        <p className="text-slate-300 text-lg">
          Loading GrainGuardian...
        </p>

      </div>

    </div>
  );
}
