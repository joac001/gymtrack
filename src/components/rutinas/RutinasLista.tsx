"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RutinaCard, { RutinaData } from "./RutinaCard";

interface Props {
  rutinas: RutinaData[];
}

export default function RutinasLista({ rutinas: inicial }: Props) {
  const router = useRouter();
  const [rutinas, setRutinas] = useState<RutinaData[]>(inicial);

  async function handleActivar(id: string) {
    const res = await fetch(`/api/routines/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activa: true }),
    });
    if (res.ok) {
      setRutinas((prev) =>
        prev.map((r) => ({ ...r, activa: r._id === id }))
      );
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm("¿Eliminar esta rutina?")) return;
    const res = await fetch(`/api/routines/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRutinas((prev) => prev.filter((r) => r._id !== id));
      router.refresh();
    }
  }

  if (rutinas.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "48px 16px",
        color: "var(--text-muted)",
      }}>
        <p style={{ fontSize: "1rem", marginBottom: "8px" }}>No tenés rutinas todavía</p>
        <p style={{ fontSize: "0.85rem" }}>Creá tu primera rutina para empezar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {rutinas.map((rutina) => (
        <RutinaCard
          key={rutina._id}
          rutina={rutina}
          onActivar={handleActivar}
          onEliminar={handleEliminar}
        />
      ))}
    </div>
  );
}
