"use client";

import dynamic from "next/dynamic";
import { nivoTheme } from "./nivoTheme";
import type { MusculoData } from "./StatsPageClient";

const ResponsiveRadar = dynamic(
  () => import("@nivo/radar").then((m) => m.ResponsiveRadar),
  { ssr: false }
);

interface Props {
  data: MusculoData[];
  unidadPeso?: "kg" | "lbs";
}

export default function MusculoRadarChart({ data, unidadPeso = "kg" }: Props) {
  if (data.length < 3) return null;

  const radarData = data.map((d) => ({
    musculo: d.musculo,
    Volumen: d.volumen,
  }));

  const top5 = data.slice(0, 5);

  return (
    <div className="flex flex-col gap-2">
      <div style={{ height: 300 }}>
        <ResponsiveRadar
          data={radarData}
          keys={["Volumen"]}
          indexBy="musculo"
          margin={{ top: 44, right: 90, bottom: 44, left: 90 }}
          borderColor={{ from: "color" }}
          gridLabelOffset={12}
          dotSize={6}
          dotColor={{ theme: "background" }}
          dotBorderWidth={2}
          colors={["#f4634a"]}
          fillOpacity={0.15}
          blendMode="normal"
          theme={{
            ...nivoTheme,
            labels: {
              text: {
                fontSize: 10,
                fill: "#e8e8e8",
                fontFamily: "var(--font-dm-sans, sans-serif)",
              },
            },
          }}
        />
      </div>

      {/* Ranking de músculos — siempre visible en mobile */}
      <div className="flex flex-col gap-1 px-1">
        {top5.map((d, i) => (
          <div key={d.musculo} className="flex items-center justify-between gap-2">
            <span
              className="text-[0.78rem] font-medium"
              style={{ color: i === 0 ? "#f4634a" : "var(--text)" }}
            >
              {d.musculo}
            </span>
            <span className="text-[0.75rem]" style={{ color: "var(--text-muted)" }}>
              {Math.round(d.volumen).toLocaleString("es-AR")} {unidadPeso}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[0.72rem] text-center" style={{ color: "var(--text-muted)" }}>
        Volumen acumulado distribuido por grupo muscular
      </p>
    </div>
  );
}
