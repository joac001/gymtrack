"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Trash2 } from "lucide-react";

interface Props {
  logId: string;
}

export default function DeleteLogButton({ logId }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    await fetch(`/api/logs/${logId}`, { method: "DELETE" });
    router.push("/historial");
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          color: "var(--text-muted)",
          padding: "8px 10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.82rem",
        }}
      >
        <Trash2 size={14} />
        Eliminar
      </button>

      {showConfirm && (
        <ConfirmDialog
          title="¿Eliminar este entrenamiento?"
          description="Esta acción no se puede deshacer."
          danger
          confirmLabel="Eliminar"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
