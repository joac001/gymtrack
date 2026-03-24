"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function UpgradeBanner() {
  return (
    <Link
      href="/pricing"
      className="flex items-center gap-3 p-3.5 no-underline"
      style={{
        background: "var(--push-bg, rgba(244,99,74,0.08))",
        border: "1px solid rgba(244,99,74,0.2)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <Sparkles size={18} style={{ color: "var(--push)", flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p
          className="text-[0.85rem] font-semibold m-0"
          style={{ color: "var(--push)" }}
        >
          Pasá a Pro
        </p>
        <p
          className="text-[0.75rem] m-0 mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Chat IA, gráficos avanzados y más
        </p>
      </div>
      <span
        className="text-[0.75rem] font-semibold shrink-0"
        style={{ color: "var(--push)" }}
      >
        $7/mes →
      </span>
    </Link>
  );
}
