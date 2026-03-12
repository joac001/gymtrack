interface SkeletonProps {
  height?: string | number;
  width?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ height = "1rem", width = "100%", borderRadius = "var(--radius-sm)", style }: SkeletonProps) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        background: "var(--border)",
        animation: "pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

// Inyectar la animación globalmente una sola vez via CSS-in-JS inline
// La animación "pulse" se define en globals.css
