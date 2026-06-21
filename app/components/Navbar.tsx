export default function Navbar() {
  return (
    <header
      className="
      sticky
      top-0
      z-50
      border-b
      border-white/10
      bg-slate-950/80
      backdrop-blur-xl
    "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        h-20
        px-6
        flex
        items-center
        justify-between
      "
      >
        <h1
          className="
          text-2xl
          font-black
          text-emerald-400
        "
        >
          GRAIN GUARDIAN
        </h1>

        <nav
          className="
          hidden
          md:flex
          gap-8
          text-sm
          text-slate-300
        "
        >
          <button>Dashboard</button>
          <button>Analytics</button>
          <button>History</button>
          <button>Reports</button>
        </nav>

        <div className="flex gap-3">

          <span
            className="
            px-3 py-2
            rounded-xl
            bg-slate-900
          "
          >
            🌐 Telugu
          </span>

          <span
            className="
            px-3 py-2
            rounded-xl
            bg-emerald-500/20
            text-emerald-300
          "
          >
            ● SAFE
          </span>

        </div>
      </div>
    </header>
  );
}
