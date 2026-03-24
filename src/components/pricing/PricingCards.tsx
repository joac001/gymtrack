"use client";

import { Check, X, Sparkles } from "lucide-react";

interface Props {
  currentPlan: "free" | "pro";
}

const FREE_FEATURES = [
  { text: "1 rutina activa", included: true },
  { text: "Historial últimos 3 meses", included: true },
  { text: "5 gráficos básicos", included: true },
  { text: "Import desde Excel", included: true },
  { text: "Chat IA con tus datos", included: false },
  { text: "Gráficos avanzados", included: false },
  { text: "Export PDF / Excel / CSV", included: false },
  { text: "Sin anuncios", included: false },
];

const PRO_FEATURES = [
  { text: "Rutinas ilimitadas", included: true },
  { text: "Historial ilimitado", included: true },
  { text: "5 gráficos básicos", included: true },
  { text: "Import desde Excel", included: true },
  { text: "Chat IA con tus datos", included: true, highlight: true },
  { text: "Gráficos avanzados", included: true, highlight: true },
  { text: "Export PDF / Excel / CSV", included: true, highlight: true },
  { text: "Sin anuncios", included: true },
];

export default function PricingCards({ currentPlan }: Props) {
  const isPro = currentPlan === "pro";

  return (
    <div className="flex flex-col gap-4">
      {/* FREE */}
      <div
        className="p-5 flex flex-col gap-4"
        style={{
          background: "var(--surface)",
          border: `1px solid ${currentPlan === "free" ? "var(--push)" : "var(--border)"}`,
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-[1.4rem] tracking-wider m-0"
              style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
            >
              FREE
            </h2>
            <p className="text-[0.8rem] m-0" style={{ color: "var(--text-muted)" }}>
              Para empezar a entrenar
            </p>
          </div>
          <div className="text-right">
            <span
              className="text-[1.8rem] font-bold"
              style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
            >
              $0
            </span>
            <p className="text-[0.75rem] m-0" style={{ color: "var(--text-muted)" }}>
              por siempre
            </p>
          </div>
        </div>

        <ul className="flex flex-col gap-2 m-0 p-0" style={{ listStyle: "none" }}>
          {FREE_FEATURES.map((f) => (
            <li key={f.text} className="flex items-center gap-2.5 text-[0.85rem]">
              {f.included ? (
                <Check size={16} style={{ color: "var(--success)", flexShrink: 0 }} />
              ) : (
                <X size={16} style={{ color: "var(--text-muted)", opacity: 0.4, flexShrink: 0 }} />
              )}
              <span style={{ color: f.included ? "var(--text)" : "var(--text-muted)", opacity: f.included ? 1 : 0.5 }}>
                {f.text}
              </span>
            </li>
          ))}
        </ul>

        {currentPlan === "free" && (
          <div
            className="text-center py-2.5 text-[0.85rem] font-semibold"
            style={{
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            Plan actual
          </div>
        )}
      </div>

      {/* PRO */}
      <div
        className="p-5 flex flex-col gap-4 relative overflow-hidden"
        style={{
          background: "var(--surface)",
          border: `1px solid ${isPro ? "var(--push)" : "var(--push)"}`,
          borderRadius: "var(--radius-lg)",
        }}
      >
        {/* Badge recomendado */}
        {!isPro && (
          <div
            className="absolute top-0 right-0 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider"
            style={{
              background: "var(--push)",
              color: "#fff",
              borderBottomLeftRadius: "var(--radius-md)",
            }}
          >
            Recomendado
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h2
              className="text-[1.4rem] tracking-wider m-0 flex items-center gap-2"
              style={{ fontFamily: "var(--font-bebas)", color: "var(--push)" }}
            >
              <Sparkles size={18} />
              PRO
            </h2>
            <p className="text-[0.8rem] m-0" style={{ color: "var(--text-muted)" }}>
              Para entrenar en serio
            </p>
          </div>
          <div className="text-right">
            <span
              className="text-[1.8rem] font-bold"
              style={{ fontFamily: "var(--font-bebas)", color: "var(--push)" }}
            >
              $7
            </span>
            <p className="text-[0.75rem] m-0" style={{ color: "var(--text-muted)" }}>
              USD / mes
            </p>
          </div>
        </div>

        <ul className="flex flex-col gap-2 m-0 p-0" style={{ listStyle: "none" }}>
          {PRO_FEATURES.map((f) => (
            <li key={f.text} className="flex items-center gap-2.5 text-[0.85rem]">
              <Check
                size={16}
                style={{
                  color: f.highlight ? "var(--push)" : "var(--success)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: f.highlight ? "var(--push)" : "var(--text)",
                  fontWeight: f.highlight ? 600 : 400,
                }}
              >
                {f.text}
              </span>
            </li>
          ))}
        </ul>

        {isPro ? (
          <div
            className="text-center py-2.5 text-[0.85rem] font-semibold"
            style={{
              borderRadius: "var(--radius-md)",
              background: "var(--push-bg)",
              border: "1px solid var(--push)",
              color: "var(--push)",
            }}
          >
            Plan actual
          </div>
        ) : (
          <button
            type="button"
            className="w-full py-3 text-[0.95rem] font-bold uppercase tracking-wider cursor-pointer"
            style={{
              background: "var(--push)",
              border: "none",
              borderRadius: "var(--radius-md)",
              color: "#fff",
              fontFamily: "var(--font-bebas)",
              letterSpacing: "0.05em",
            }}
            onClick={() => {
              // TODO: Integrar con Talo checkout cuando esté listo
              alert("Próximamente — Integración de pagos en desarrollo");
            }}
          >
            Upgrade a Pro
          </button>
        )}
      </div>

      {/* Nota */}
      <p
        className="text-[0.75rem] text-center m-0 mt-1"
        style={{ color: "var(--text-muted)", opacity: 0.6 }}
      >
        Podés cancelar en cualquier momento. Los pesos se almacenan siempre en kg.
      </p>
    </div>
  );
}
