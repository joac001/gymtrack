import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import UnidadPesoSelector from "@/components/configuracion/UnidadPesoSelector";

export default async function ConfiguracionPage() {
  const session = await auth();

  await connectDB();
  const user = await User.findById(session!.user.id).lean();
  const unidadPeso = ((user as { unidadPeso?: string } | null)?.unidadPeso ?? "kg") as "kg" | "lbs";

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1
        className="text-[1.8rem] tracking-wider m-0"
        style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
      >
        CONFIGURACIÓN
      </h1>

      <section className="flex flex-col gap-3">
        <p
          className="text-[0.72rem] font-semibold uppercase tracking-wider m-0"
          style={{ color: "var(--text-muted)" }}
        >
          Preferencias
        </p>
        <UnidadPesoSelector initialValue={unidadPeso} />
      </section>
    </div>
  );
}
