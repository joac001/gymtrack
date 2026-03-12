export const INTENSIDADES = [
  { n: 1, emoji: "😴", color: "#22c55e" },
  { n: 2, emoji: "🙂", color: "#22c55e" },
  { n: 3, emoji: "😊", color: "#4ade80" },
  { n: 4, emoji: "😌", color: "#a3e635" },
  { n: 5, emoji: "😤", color: "#f59e0b" },
  { n: 6, emoji: "😓", color: "#f97316" },
  { n: 7, emoji: "😰", color: "#f97316" },
  { n: 8, emoji: "😫", color: "#ef4444" },
  { n: 9, emoji: "🥵", color: "#dc2626" },
  { n: 10, emoji: "💀", color: "#991b1b" },
] as const;

export function getIntensidad(n: number) {
  return INTENSIDADES.find((i) => i.n === n) ?? { n, emoji: "—", color: "var(--text-muted)" };
}

export function intensidadLabel(n: number) {
  if (n <= 3) return "Suave";
  if (n <= 5) return "Moderada";
  if (n <= 7) return "Intensa";
  if (n <= 9) return "Muy intensa";
  return "Máxima";
}
