import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";
import WorkoutLog from "@/models/WorkoutLog";

type Params = { params: Promise<{ id: string; sesionId: string }> };

// DELETE /api/routines/[id]/sesiones/[sesionId]
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id, sesionId } = await params;

  try {
    await connectDB();

    const rutina = await Routine.findOne({ _id: id, userId: session.user.id });
    if (!rutina) {
      return NextResponse.json({ error: "Rutina no encontrada" }, { status: 404 });
    }

    if (rutina.sesiones.length <= 1) {
      return NextResponse.json(
        { error: "No podés eliminar la única sesión de la rutina." },
        { status: 400 },
      );
    }

    const sesion = rutina.sesiones.find(
      (s: { _id: { toString: () => string } }) => s._id.toString() === sesionId,
    );
    if (!sesion) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
    }

    // Contar logs asociados a esta sesión
    const logsConservados = await WorkoutLog.countDocuments({
      userId: session.user.id,
      sesionId,
    });

    await Routine.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $pull: { sesiones: { _id: sesionId } } },
    );

    return NextResponse.json({ ok: true, logsConservados });
  } catch (err) {
    console.error("[DELETE /api/routines/:id/sesiones/:sesionId]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
