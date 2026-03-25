import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";

// GET /api/logs — historial del usuario
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 20);

  await connectDB();

  // Gate: free solo ve últimos 3 meses
  const plan = session.user.plan === "pro" ? "pro" : "free";
  const query: Record<string, unknown> = { userId: session.user.id };
  if (plan === "free") {
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
    query.fecha = { $gte: tresMesesAtras };
  }

  const logs = await WorkoutLog.find(query)
    .sort({ fecha: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json(logs);
}

// POST /api/logs — registrar entrenamiento
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      rutinaId,
      sesionId,
      sesionNombre,
      sesionColor,
      fecha,
      ejercicios,
      intensidad,
      notasPre,
      notas,
    } = body;

    if (!rutinaId || !sesionId || !sesionNombre || !sesionColor) {
      return NextResponse.json(
        { error: "Faltan datos de sesión" },
        { status: 400 },
      );
    }
    if (!intensidad || intensidad < 1 || intensidad > 10) {
      return NextResponse.json(
        { error: "Intensidad debe estar entre 1 y 10" },
        { status: 400 },
      );
    }

    await connectDB();

    const log = await WorkoutLog.create({
      userId: session.user.id,
      rutinaId,
      sesionId,
      sesionNombre,
      sesionColor,
      fecha: fecha ? new Date(fecha) : new Date(),
      ejercicios: ejercicios ?? [],
      intensidad,
      notasPre: notasPre ?? undefined,
      notas: notas ?? undefined,
    });

    return NextResponse.json(log, { status: 201 });
  } catch (err) {
    console.error("[POST /api/logs]", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
