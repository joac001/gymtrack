"use client";

interface Props {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  confirmLabel?: string;
}

export default function ConfirmDialog({
  title,
  description,
  onConfirm,
  onCancel,
  danger = false,
  confirmLabel = "Confirmar",
}: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(0,0,0,0.6)",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          maxWidth: "400px",
          width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-[1rem] font-semibold m-0 mb-2"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h3>
        {description && (
          <p
            className="text-[0.85rem] m-0 mb-5"
            style={{ color: "var(--text-muted)", lineHeight: 1.5 }}
          >
            {description}
          </p>
        )}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="text-[0.85rem] px-4 py-2 cursor-pointer"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-muted)",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="text-[0.85rem] px-4 py-2 cursor-pointer font-semibold"
            style={{
              background: danger ? "#ef4444" : "var(--push)",
              border: "none",
              borderRadius: "var(--radius-md)",
              color: "#fff",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
