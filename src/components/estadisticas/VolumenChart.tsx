"use client";

import dynamic from "next/dynamic";
import { nivoTheme } from "./nivoTheme";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

interface Props {
  data: { semana: string; volumen: number }[];
}

export default function VolumenChart({ data }: Props) {
  return (
    <div style={{ height: 200 }}>
      <ResponsiveBar
        data={data}
        keys={["volumen"]}
        indexBy="semana"
        margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
        padding={0.35}
        colors={["#f4634a"]}
        borderRadius={3}
        theme={nivoTheme}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: -35,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          format: (v) => `${(v / 1000).toFixed(0)}k`,
        }}
        gridYValues={4}
        enableLabel={false}
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
            <strong>{indexValue}</strong>
            <br />
            {value.toLocaleString("es-AR")} kg vol
          </div>
        )}
      />
    </div>
  );
}
