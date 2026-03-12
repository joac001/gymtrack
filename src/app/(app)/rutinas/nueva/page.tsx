import Link from "next/link";
import RutinaForm from "@/components/rutinas/RutinaForm";

export default function NuevaRutinaPage() {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/rutinas"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
        >
          ← Mis rutinas
        </Link>
        {/* <h1 style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "1.8rem",
          letterSpacing: "0.05em",
          color: "var(--text)",
          margin: "8px 0 0",
        }}>
          NUEVA RUTINA
        </h1> */}
      </div>
      <RutinaForm />
    </div>
  );
}
