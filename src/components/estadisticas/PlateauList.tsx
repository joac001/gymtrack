"use client";

import { TrendingUp } from "lucide-react";
import type { PlateauData } from "./StatsPageClient";
import { formatPeso } from "@/lib/unidades";

interface Props {
  plateaus: PlateauData[];
  unidadPeso?: "kg" | "lbs";
}

export default function PlateauList({ plateaus, unidadPeso = "kg" }: Props) {
  if (plateaus.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {plateaus.map((p) => (
        <div
          key={p.ejercicio}
          className="flex items-center justify-between gap-3 p-3"
          style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="text-[0.9rem] font-medium truncate"
              style={{ color: "var(--text)" }}
            >
              {p.ejercicio}
            </span>
            <span className="text-[0.78rem]" style={{ color: "var(--text-muted)" }}>
              Último peso: {formatPeso(p.ultimoPeso, unidadPeso)}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className="text-[0.78rem] font-semibold px-2 py-0.5"
              style={{
                background: "rgba(245,158,11,0.15)",
                color: "#f59e0b",
                borderRadius: "999px",
              }}
            >
              {p.semanas} sem sin subir
            </span>
            <span className="flex items-center gap-1 text-[0.72rem]" style={{ color: "var(--text-muted)" }}>
              <TrendingUp size={11} />
              Cambiá el estímulo
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
