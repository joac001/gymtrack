import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          style={{
            fontSize: "0.8rem",
            fontWeight: "500",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          background: "var(--surface)",
          border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
          borderRadius: "var(--radius-md)",
          color: "var(--text)",
          fontSize: "1rem",
          padding: "12px 14px",
          outline: "none",
          width: "100%",
          transition: "border-color 0.15s",
          ...props.style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--push)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "var(--danger)" : "var(--border)";
          props.onBlur?.(e);
        }}
      />
      {error && (
        <span style={{ fontSize: "0.8rem", color: "var(--danger)" }}>{error}</span>
      )}
    </div>
  );
}
