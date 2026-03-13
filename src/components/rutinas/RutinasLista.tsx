"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RutinaCard, { RutinaData } from "./RutinaCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Props {
  rutinas: RutinaData[];
}

export default function RutinasLista({ rutinas: inicial }: Props) {
  const router = useRouter();
  const [rutinas, setRutinas] = useState<RutinaData[]>(inicial);
  const [pendingEliminar, setPendingEliminar] = useState<{ id: string; nombre: string } | null>(null);

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

  async function handleDesactivar(id: string) {
    const res = await fetch(`/api/routines/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activa: false }),
    });
    if (res.ok) {
      setRutinas((prev) =>
        prev.map((r) => ({ ...r, activa: r._id === id ? false : r.activa }))
      );
    }
  }

  async function confirmarEliminar() {
    if (!pendingEliminar) return;
    const res = await fetch(`/api/routines/${pendingEliminar.id}`, { method: "DELETE" });
    if (res.ok) {
      setRutinas((prev) => prev.filter((r) => r._id !== pendingEliminar.id));
      router.refresh();
    }
    setPendingEliminar(null);
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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rutinas.map((rutina) => (
          <RutinaCard
            key={rutina._id}
            rutina={rutina}
            onActivar={handleActivar}
            onDesactivar={handleDesactivar}
            onEliminar={(id) => setPendingEliminar({ id, nombre: rutina.nombre })}
          />
        ))}
      </div>

      {pendingEliminar && (
        <ConfirmDialog
          title={`¿Eliminar «${pendingEliminar.nombre}»?`}
          description="Los entrenamientos que hayas registrado se conservarán en tu historial."
          danger
          confirmLabel="Eliminar"
          onConfirm={confirmarEliminar}
          onCancel={() => setPendingEliminar(null)}
        />
      )}
    </>
  );
}
