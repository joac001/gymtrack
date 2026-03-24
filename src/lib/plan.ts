import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export type Plan = "free" | "pro";

/**
 * Obtiene el plan del usuario autenticado.
 * Usa la sesión JWT (rápido) pero puede verificar contra DB si se necesita frescura.
 */
export async function getUserPlan(): Promise<{ userId: string; plan: Plan } | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return {
    userId: session.user.id,
    plan: session.user.plan ?? "free",
  };
}

/**
 * Verifica si el usuario tiene plan Pro.
 * Para usar en API routes como gate rápido.
 */
export async function requirePro(): Promise<{
  userId: string;
  plan: Plan;
  authorized: boolean;
}> {
  const result = await getUserPlan();
  if (!result) return { userId: "", plan: "free", authorized: false };

  return {
    ...result,
    authorized: result.plan === "pro",
  };
}

/**
 * Obtiene el plan fresco desde MongoDB (para cuando el JWT puede estar desactualizado).
 */
export async function getFreshPlan(userId: string): Promise<Plan> {
  await connectDB();
  const user = await User.findById(userId).select("plan").lean();
  return ((user as { plan?: string } | null)?.plan as Plan) ?? "free";
}
