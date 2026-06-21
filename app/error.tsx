"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="max-w-lg bg-slate-900 rounded-3xl p-10 border border-red-500/30 shadow-2xl">

        <h1 className="text-3xl font-black text-red-400 mb-4">
          GrainGuardian Error
        </h1>

        <p className="text-slate-300 mb-8">
          {error.message}
        </p>

        <button
          onClick={reset}
          className="
            px-6 py-3
            bg-emerald-400
            text-slate-950
            rounded-xl
            font-bold
            hover:scale-105
            transition
          "
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
