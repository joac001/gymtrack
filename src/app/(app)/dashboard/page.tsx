import { Suspense } from "react";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";
import Link from "next/link";
import StatsSection from "@/components/dashboard/StatsSection";
import WeekCalendar from "@/components/dashboard/WeekCalendar";
import { Skeleton } from "@/components/ui/Skeleton";

const DIAS_ES: Record<number, string> = {
  0: "domingo",
  1: "lunes",
  2: "martes",
  3: "miercoles",
  4: "jueves",
  5: "viernes",
  6: "sabado",
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  await connectDB();
  const rutina = await Routine.findOne({ userId, activa: true }).lean();

  const nowAR = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
    }),
  );
  const today = DIAS_ES[nowAR.getDay()];

  const fechaLabel = nowAR.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const rutinaId = rutina?._id?.toString();

  const sesionesSerializadas = rutina
    ? rutina.sesiones
        .sort((a, b) => a.orden - b.orden)
        .map((s) => {
          const ejerciciosOrdenados = [...s.ejercicios].sort(
            (a, b) => a.orden - b.orden,
          );
          return {
            id: s._id.toString(),
            nombre: s.nombre,
            color: s.color,
            dia: s.dia,
            ejerciciosCount: s.ejercicios.length,
            ejerciciosPreview: ejerciciosOrdenados
              .slice(0, 5)
              .map((e) => e.nombre),
          };
        })
    : [];

  return (
    <div>
      {/* Saludo */}
      <div className="mb-7">
        <h1
          className="text-[2rem] tracking-wider m-0"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
        >
          BIENVENIDO, {session?.user?.name?.toUpperCase() ?? "ATLETA"}
        </h1>
        <p className="text-[0.9rem] mt-1 capitalize" style={{ color: "var(--text-muted)" }}>
          {fechaLabel}
        </p>
      </div>

      {/* Sin rutina activa */}
      {!rutina && (
        <div
          className="p-8 text-center mb-7"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <p className="text-[0.9rem] mb-4" style={{ color: "var(--text-muted)" }}>
            No tenés una rutina activa.
          </p>
          <Link
            href="/rutinas"
            className="text-[0.9rem] font-semibold no-underline"
            style={{ color: "var(--push)" }}
          >
            Ir a Rutinas →
          </Link>
        </div>
      )}

      {/* Layout responsive: mobile 1 col, desktop 2 col */}
      <div className={rutina ? "lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start" : ""}>
        {/* Calendario semanal */}
        {rutina && (
          <WeekCalendar
            sesiones={sesionesSerializadas}
            rutinaId={rutinaId!}
            today={today}
          />
        )}

        {/* Estadísticas */}
        <Suspense
          fallback={
            <div
              className={`flex flex-col gap-4 ${rutina ? "mt-7 lg:mt-0" : ""}`}
            >
              <Skeleton style={{ width: "100px", height: "0.8rem" }} />
              <Skeleton
                style={{ width: "100%", height: "80px", borderRadius: "var(--radius-lg)" }}
              />
              <Skeleton
                style={{ width: "100%", height: "120px", borderRadius: "var(--radius-lg)" }}
              />
            </div>
          }
        >
          <div className={rutina ? "mt-7 lg:mt-0" : ""}>
            <StatsSection userId={userId} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
