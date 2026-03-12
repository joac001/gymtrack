import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";
import WorkoutLog from "@/models/WorkoutLog";

type Params = { params: Promise<{ id: string }> };

// PUT /api/routines/[id] — editar rutina (incluyendo activar)
export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    await connectDB();

    // Si se está activando esta rutina, desactivar todas las demás
    if (body.activa === true) {
      await Routine.updateMany(
        { userId: session.user.id, _id: { $ne: id } },
        { $set: { activa: false } }
      );
    }

    const rutina = await Routine.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!rutina) {
      return NextResponse.json({ error: "Rutina no encontrada" }, { status: 404 });
    }

    return NextResponse.json(rutina);
  } catch (err) {
    console.error("[PUT /api/routines/:id]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// DELETE /api/routines/[id] — eliminar rutina
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectDB();

    const rutina = await Routine.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!rutina) {
      return NextResponse.json({ error: "Rutina no encontrada" }, { status: 404 });
    }

    const logsConservados = await WorkoutLog.countDocuments({
      userId: session.user.id,
      rutinaId: id,
    });

    return NextResponse.json({ ok: true, logsConservados });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
