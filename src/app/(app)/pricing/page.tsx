import { auth } from "@/auth";
import PricingCards from "@/components/pricing/PricingCards";

export default async function PricingPage() {
  const session = await auth();
  const plan = session?.user?.plan === "pro" ? "pro" : "free";

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div className="text-center">
        <h1
          className="text-[2rem] tracking-wider m-0"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
        >
          ELEGÍ TU PLAN
        </h1>
        <p className="text-[0.9rem] mt-1 m-0" style={{ color: "var(--text-muted)" }}>
          Desbloqueá todo el potencial de GymTrack
        </p>
      </div>

      <PricingCards currentPlan={plan} />
    </div>
  );
}
