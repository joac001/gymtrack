import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";

type Params = { params: Promise<{ id: string }> };

// GET /api/logs/[id] — detalle de un entrenamiento
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectDB();
    const log = await WorkoutLog.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!log) {
      return NextResponse.json({ error: "Registro no encontrado" }, { status: 404 });
    }

    return NextResponse.json(log);
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
