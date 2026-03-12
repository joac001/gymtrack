import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <Skeleton style={{ width: "200px", height: "2rem", marginBottom: "8px" }} />
        <Skeleton style={{ width: "140px", height: "0.9rem" }} />
      </div>
      <Skeleton style={{ width: "80px", height: "0.8rem", marginBottom: "12px" }} />
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <Skeleton style={{ width: "120px", height: "1.4rem", marginBottom: "6px" }} />
          <Skeleton style={{ width: "80px", height: "0.8rem" }} />
        </div>
        <div style={{ padding: "14px 16px" }}>
          <Skeleton style={{ width: "100%", height: "0.8rem", marginBottom: "6px" }} />
          <Skeleton style={{ width: "70%", height: "0.8rem", marginBottom: "14px" }} />
          <Skeleton style={{ width: "100%", height: "44px", borderRadius: "var(--radius-md)" }} />
        </div>
      </div>
    </div>
  );
}
