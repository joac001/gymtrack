import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id).lean();
  const unidadPeso = (user as { unidadPeso?: string } | null)?.unidadPeso ?? "kg";

  return NextResponse.json({ unidadPeso });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json() as { unidadPeso?: string };

  if (!body.unidadPeso || !["kg", "lbs"].includes(body.unidadPeso)) {
    return NextResponse.json({ error: "unidadPeso debe ser 'kg' o 'lbs'" }, { status: 400 });
  }

  await connectDB();
  await User.findByIdAndUpdate(session.user.id, { unidadPeso: body.unidadPeso });

  return NextResponse.json({ unidadPeso: body.unidadPeso });
}
