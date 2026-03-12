import { Skeleton } from "@/components/ui/Skeleton";

export default function RutinasSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Skeleton height="1.1rem" width="60%" />
          <Skeleton height="0.8rem" width="30%" />
          <div style={{ display: "flex", gap: "6px" }}>
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} height="24px" width="32px" borderRadius="var(--radius-sm)" />
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Skeleton height="36px" borderRadius="var(--radius-md)" />
            <Skeleton height="36px" borderRadius="var(--radius-md)" />
          </div>
        </div>
      ))}
    </div>
  );
}
