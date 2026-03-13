"use client";

import dynamic from "next/dynamic";
import { nivoTheme } from "./nivoTheme";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

export interface SesionFrecuencia {
  sesion: string;
  color: string;
  cantidad: number;
  [key: string]: string | number;
}

interface Props {
  data: SesionFrecuencia[];
}

export default function FrecuenciaChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.cantidad - a.cantidad);

  return (
    <div style={{ height: Math.max(160, sorted.length * 44) }}>
      <ResponsiveBar
        data={sorted}
        keys={["cantidad"]}
        indexBy="sesion"
        layout="horizontal"
        margin={{ top: 0, right: 56, bottom: 10, left: 100 }}
        padding={0.35}
        colors={({ data }) => String((data as unknown as SesionFrecuencia).color)}
        borderRadius={3}
        theme={nivoTheme}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
        }}
        axisBottom={null}
        gridXValues={[]}
        enableLabel
        label={({ value }) => `${value} veces`}
        labelSkipWidth={40}
        labelTextColor="#e8e8e8"
        tooltip={({ value, indexValue }) => (
          <div
            style={{
              background: "#161617",
              border: "1px solid #252527",
              borderRadius: "8px",
              padding: "6px 10px",
              fontSize: "12px",
              color: "#e8e8e8",
            }}
          >
            <strong>{indexValue}</strong> — {value} entrenamientos
          </div>
        )}
      />
    </div>
  );
}
