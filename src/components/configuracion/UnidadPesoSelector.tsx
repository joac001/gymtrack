"use client";

import { useState, useTransition } from "react";

interface Props {
  initialValue: "kg" | "lbs";
}

export default function UnidadPesoSelector({ initialValue }: Props) {
  const [unidad, setUnidad] = useState<"kg" | "lbs">(initialValue);
  const [guardado, setGuardado] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleChange(valor: "kg" | "lbs") {
    if (valor === unidad) return;
    setUnidad(valor);
    setGuardado(false);

    startTransition(async () => {
      await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unidadPeso: valor }),
      });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    });
  }

  return (
    <div
      className="flex flex-col gap-4 p-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <div>
        <p className="text-[0.9rem] font-semibold m-0" style={{ color: "var(--text)" }}>
          Unidad de peso
        </p>
        <p className="text-[0.8rem] mt-0.5 m-0" style={{ color: "var(--text-muted)" }}>
          Los pesos se muestran en esta unidad en toda la app. El almacenamiento interno siempre es en kg.
        </p>
      </div>

      <div className="flex gap-2">
        {(["kg", "lbs"] as const).map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => handleChange(op)}
            disabled={isPending}
            className="px-6 py-2.5 text-[0.9rem] font-semibold cursor-pointer transition-all disabled:opacity-60"
            style={{
              borderRadius: "var(--radius-md)",
              border: `1px solid ${unidad === op ? "var(--push)" : "var(--border)"}`,
              background: unidad === op ? "var(--push-bg)" : "transparent",
              color: unidad === op ? "var(--push)" : "var(--text-muted)",
            }}
          >
            {op}
          </button>
        ))}

        {isPending && (
          <span className="text-[0.8rem] self-center" style={{ color: "var(--text-muted)" }}>
            Guardando...
          </span>
        )}
        {guardado && !isPending && (
          <span className="text-[0.8rem] self-center" style={{ color: "var(--success, #22c55e)" }}>
            Guardado ✓
          </span>
        )}
      </div>
    </div>
  );
}
