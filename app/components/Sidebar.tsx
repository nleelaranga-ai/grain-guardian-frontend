"use client";

export default function Sidebar() {
  const items = [
    "Command Center",
    "Critical Loss Points",
    "History",
    "Reports",
    "Settings"
  ];

  return (
    <aside className="w-80 bg-slate-900 border-r border-white/10 p-6">
      <h1 className="text-3xl font-black text-emerald-400">
        GRAINGUARDIAN
      </h1>

      <p className="text-xs text-slate-400 mt-2">
        Decision Intelligence V3
      </p>

      <nav className="mt-12 space-y-4">
        {items.map((item) => (
          <button
            key={item}
            className="
              w-full
              text-left
              p-4
              rounded-xl
              hover:bg-slate-800
              transition
            "
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}