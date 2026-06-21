export default function KPICards() {
  const cards = [
    {
      title: "GHI",
      value: "92/100",
      color: "text-emerald-400",
    },
    {
      title: "Projected Loss",
      value: "₹12,540",
      color: "text-red-400",
    },
    {
      title: "Fungal Risk",
      value: "LOW",
      color: "text-cyan-400",
    },
    {
      title: "Storage Status",
      value: "SAFE",
      color: "text-emerald-400",
    },
  ];

  return (
    <section
      className="
      grid
      md:grid-cols-2
      xl:grid-cols-4
      gap-6
    "
    >
      {cards.map((card) => (
        <div
          key={card.title}
          className="
          rounded-3xl
          bg-slate-900/70
          backdrop-blur-xl
          p-8
          border
          border-white/5
        "
        >
          <p className="text-slate-400">
            {card.title}
          </p>

          <h2
            className={`
            mt-4
            text-4xl
            font-black
            ${card.color}
          `}
          >
            {card.value}
          </h2>
        </div>
      ))}
    </section>
  );
}
