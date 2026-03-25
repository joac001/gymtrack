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
    plan: normalizePlan(session.user.plan),
  };
}

/**
 * Verifica si el usuario tiene plan Pro.
 * Consulta la DB directamente para evitar JWT desactualizado.
 */
export async function requirePro(): Promise<{
  userId: string;
  plan: Plan;
  authorized: boolean;
}> {
  const session = await auth();
  if (!session?.user?.id) return { userId: "", plan: "free", authorized: false };

  const plan = await getFreshPlan(session.user.id);

  return {
    userId: session.user.id,
    plan,
    authorized: plan === "pro",
  };
}

/**
 * Obtiene el plan fresco desde MongoDB (para cuando el JWT puede estar desactualizado).
 */
export async function getFreshPlan(userId: string): Promise<Plan> {
  await connectDB();
  const user = await User.findById(userId).select("plan").lean();
  return normalizePlan((user as { plan?: string } | null)?.plan);
}

/**
 * Normaliza cualquier valor a "free" | "pro".
 * Si no es exactamente "pro", es "free". Punto.
 */
export function normalizePlan(value: unknown): Plan {
  return value === "pro" ? "pro" : "free";
}
