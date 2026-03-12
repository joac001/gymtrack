import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";
import RutinasLista from "@/components/rutinas/RutinasLista";
import RutinasSkeleton from "@/components/rutinas/RutinasSkeleton";

async function RutinasContent() {
  const session = await auth();
  await connectDB();

  const rutinas = await Routine.find({ userId: session!.user.id })
    .sort({ creadoEn: -1 })
    .lean();

  const rutinasSerializadas = rutinas.map((r) => ({
    ...r,
    _id: r._id.toString(),
    sesiones: r.sesiones.map((s) => ({
      ...s,
      _id: s._id.toString(),
      ejercicios: s.ejercicios.map((e) => ({
        ...e,
        _id: e._id.toString(),
      })),
    })),
    creadoEn: r.creadoEn?.toISOString(),
    actualizadoEn: r.actualizadoEn?.toISOString(),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <RutinasLista rutinas={rutinasSerializadas as any} />;
}

export default function RutinasPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-[1.8rem] tracking-wider m-0"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
        >
          MIS RUTINAS
        </h1>
        <Link
          href="/rutinas/nueva"
          className="text-[0.9rem] font-semibold no-underline px-4 py-2"
          style={{
            background: "var(--push)",
            color: "#fff",
            borderRadius: "var(--radius-md)",
          }}
        >
          + Nueva
        </Link>
      </div>

      <Suspense fallback={<RutinasSkeleton />}>
        <RutinasContent />
      </Suspense>
    </div>
  );
}
