import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{
        background: isPrimary ? "var(--push)" : "transparent",
        border: isPrimary ? "none" : "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        color: isPrimary ? "#fff" : "var(--text)",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontSize: "0.95rem",
        fontWeight: "600",
        opacity: disabled || loading ? 0.6 : 1,
        padding: "12px 20px",
        width: "100%",
        transition: "opacity 0.15s",
        fontFamily: "inherit",
        ...props.style,
      }}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
}
