import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Routine from "@/models/Routine";

type Params = { params: Promise<{ id: string; sesionId: string; ejId: string }> };

// DELETE /api/routines/[id]/sesiones/[sesionId]/ejercicios/[ejId]
export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id, sesionId, ejId } = await params;

  try {
    await connectDB();

    const rutina = await Routine.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $pull: { "sesiones.$[s].ejercicios": { _id: ejId } } },
      {
        arrayFilters: [{ "s._id": sesionId }],
        new: true,
      },
    );

    if (!rutina) {
      return NextResponse.json({ error: "Rutina no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/routines/:id/sesiones/:sesionId/ejercicios/:ejId]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
