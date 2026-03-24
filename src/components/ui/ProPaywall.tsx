"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

interface Props {
  title: string;
  children: React.ReactNode;
}

/**
 * Envuelve contenido Pro con un overlay blur + CTA de upgrade.
 * El contenido se renderiza debajo (blurred) para que el usuario vea qué se está perdiendo.
 */
export default function ProPaywall({ title, children }: Props) {
  return (
    <div className="relative">
      {/* Contenido blurred */}
      <div
        style={{
          filter: "blur(6px)",
          opacity: 0.4,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {children}
      </div>

      {/* Overlay con CTA */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4"
        style={{ zIndex: 10 }}
      >
        <div
          className="flex flex-col items-center gap-2 p-5"
          style={{
            background: "rgba(14, 14, 15, 0.85)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Lock size={20} style={{ color: "var(--push)" }} />
          <p
            className="text-[0.9rem] font-semibold m-0 text-center"
            style={{ color: "var(--text)" }}
          >
            {title}
          </p>
          <p
            className="text-[0.78rem] m-0 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Disponible en el plan Pro
          </p>
          <Link
            href="/pricing"
            className="mt-1 px-5 py-2 text-[0.82rem] font-bold uppercase tracking-wider no-underline"
            style={{
              background: "var(--push)",
              color: "#fff",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-bebas)",
              letterSpacing: "0.05em",
            }}
          >
            Ver planes
          </Link>
        </div>
      </div>
    </div>
  );
}
