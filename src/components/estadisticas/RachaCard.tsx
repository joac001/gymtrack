interface Props {
  rachaActual: number;
  rachaMaxima: number;
  totalEntrenamientos: number;
  totalSemanas: number;
}

export default function RachaCard({
  rachaActual,
  rachaMaxima,
  totalEntrenamientos,
  totalSemanas,
}: Props) {
  const stats = [
    {
      label: "Racha actual",
      value: rachaActual,
      unit: rachaActual === 1 ? "semana" : "semanas",
      highlight: rachaActual > 0,
      emoji: "🔥",
    },
    {
      label: "Mejor racha",
      value: rachaMaxima,
      unit: rachaMaxima === 1 ? "semana" : "semanas",
      highlight: false,
      emoji: "🏆",
    },
    {
      label: "Entrenamientos",
      value: totalEntrenamientos,
      unit: "totales",
      highlight: false,
      emoji: "💪",
    },
    {
      label: "Semanas activo",
      value: totalSemanas,
      unit: "semanas",
      highlight: false,
      emoji: "📅",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-1 p-4"
          style={{
            background: "var(--surface)",
            border: `1px solid ${s.highlight ? "var(--push)" : "var(--border)"}`,
            borderRadius: "var(--radius-lg)",
          }}
        >
          <span className="text-xl leading-none">{s.emoji}</span>
          <span
            className="text-[2rem] font-bold leading-none mt-1"
            style={{ color: s.highlight ? "var(--push)" : "var(--text)", fontFamily: "var(--font-bebas)" }}
          >
            {s.value}
          </span>
          <span className="text-[0.72rem] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
