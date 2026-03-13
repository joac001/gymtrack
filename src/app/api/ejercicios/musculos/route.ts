import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import EjercicioMusculos from "@/models/EjercicioMusculos";
import { clasificarEjercicios, normalizarNombre } from "@/lib/gemini-musculos";

// POST /api/ejercicios/musculos
// Body: { nombres: string[] }
// Devuelve: { [nombreNorm]: [{ nombre, porcentaje }] }
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { nombres } = (await req.json()) as { nombres: string[] };
  if (!Array.isArray(nombres) || nombres.length === 0) {
    return NextResponse.json({});
  }

  await connectDB();

  // Normalizar todos los nombres
  const nombresNorm = nombres.map(normalizarNombre);

  // Buscar los que ya están en cache
  const cacheados = await EjercicioMusculos.find({
    nombreNorm: { $in: nombresNorm },
  }).lean();

  const resultado: Record<string, { nombre: string; porcentaje: number }[]> = {};
  const cacheadosSet = new Set<string>();

  for (const doc of cacheados) {
    resultado[doc.nombreNorm] = doc.musculos;
    cacheadosSet.add(doc.nombreNorm);
  }

  // Clasificar con Gemini solo los que faltan
  const faltantes = nombresNorm.filter((n) => !cacheadosSet.has(n));

  if (faltantes.length > 0) {
    try {
      const mapa = await clasificarEjercicios(faltantes);

      // Persistir los nuevos en MongoDB
      const docs = [...mapa.entries()].map(([nombreNorm, musculos]) => ({
        nombreNorm,
        musculos,
        creadoEn: new Date(),
      }));

      if (docs.length > 0) {
        await EjercicioMusculos.insertMany(docs, { ordered: false }).catch(() => {
          // Si hay duplicados por race condition, ignorar
        });
      }

      for (const [nombreNorm, musculos] of mapa) {
        resultado[nombreNorm] = musculos;
      }
    } catch (err) {
      console.error("[POST /api/ejercicios/musculos] Error Gemini:", err);
      // Fallar silenciosamente — devolver solo los cacheados
    }
  }

  return NextResponse.json(resultado);
}
