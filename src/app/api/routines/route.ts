import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";

// GET /api/routines — listar rutinas del usuario
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  await connectDB();
  const rutinas = await Routine.find({ userId: session.user.id }).sort({ creadoEn: -1 });

  return NextResponse.json(rutinas);
}

// POST /api/routines — crear nueva rutina
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nombre, sesiones = [] } = body;

    if (!nombre?.trim()) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
    }

    await connectDB();

    const rutina = await Routine.create({
      userId: session.user.id,
      nombre: nombre.trim(),
      activa: false,
      sesiones,
    });

    return NextResponse.json(rutina, { status: 201 });
  } catch (err) {
    console.error("[POST /api/routines]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
