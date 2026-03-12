import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";

interface Props {
  userId: string;
}

function getISOWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    );
  return `${d.getFullYear()}-${String(weekNum).padStart(2, "0")}`;
}

function calcRacha(semanas: string[]): number {
  if (semanas.length === 0) return 0;
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }),
  );
  const semanaActual = getISOWeek(now);
  const semanaAnterior = getISOWeek(new Date(now.getTime() - 7 * 86400000));
  const sorted = [...new Set(semanas)].sort((a, b) => b.localeCompare(a));
  const masReciente = sorted[0];
  if (masReciente !== semanaActual && masReciente !== semanaAnterior) return 0;

  let racha = 0;
  let expectedYear = parseInt(masReciente.split("-")[0]);
  let expectedWeek = parseInt(masReciente.split("-")[1]);

  for (const s of sorted) {
    const [y, w] = s.split("-").map(Number);
    if (y === expectedYear && w === expectedWeek) {
      racha++;
      expectedWeek--;
      if (expectedWeek === 0) { expectedYear--; expectedWeek = 52; }
    } else break;
  }
  return racha;
}

export default async function StatsSection({ userId }: Props) {
  await connectDB();

  const logs = await WorkoutLog.find({ userId }).sort({ fecha: -1 }).limit(100).lean();
  if (logs.length === 0) return null;

  const semanasConEntrenamiento = logs.map((l) => getISOWeek(new Date(l.fecha)));
  const racha = calcRacha(semanasConEntrenamiento);

  return (
    <div
      className="flex items-center justify-between p-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Racha */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ background: racha > 0 ? "var(--push-bg)" : "var(--border)" }}
        >
          <span
            className="text-[1.4rem] leading-none"
            style={{
              fontFamily: "var(--font-bebas)",
              color: racha > 0 ? "var(--push)" : "var(--text-muted)",
            }}
          >
            {racha}
          </span>
        </div>
        <div>
          <p className="text-[0.9rem] font-semibold m-0" style={{ color: "var(--text)" }}>
            {racha === 1
              ? "🔥 1 semana seguida"
              : racha > 1
                ? `🔥 ${racha} semanas seguidas`
                : "Sin racha activa"}
          </p>
          <p className="text-[0.78rem] m-0 mt-0.5" style={{ color: "var(--text-muted)" }}>
            {logs.length} entrenamiento{logs.length !== 1 ? "s" : ""} en total
          </p>
        </div>
      </div>

      {/* Link a estadísticas */}
      <Link
        href="/estadisticas"
        className="text-[0.8rem] font-medium shrink-0 no-underline"
        style={{ color: "var(--push)" }}
      >
        Ver más →
      </Link>
    </div>
  );
}
