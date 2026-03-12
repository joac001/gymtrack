import { Skeleton } from "@/components/ui/Skeleton";

export default function HistorialLoading() {
  return (
    <div>
      <Skeleton style={{ width: "140px", height: "1.8rem", marginBottom: "24px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Skeleton style={{ width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Skeleton style={{ width: "120px", height: "0.9rem", marginBottom: "6px" }} />
              <Skeleton style={{ width: "180px", height: "0.75rem" }} />
            </div>
            <Skeleton style={{ width: "32px", height: "0.85rem" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
