"use client";

import dynamic from "next/dynamic";
import { nivoTheme } from "./nivoTheme";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false }
);

interface Props {
  data: { x: string; y: number }[];
}

export default function IntensidadChart({ data }: Props) {
  if (data.length < 2) {
    return (
      <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
        Necesitás más entrenamientos para ver la tendencia de intensidad.
      </p>
    );
  }

  return (
    <div style={{ height: 180 }}>
      <ResponsiveLine
        data={[{ id: "intensidad", data }]}
        margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: 1, max: 10, nice: false }}
        curve="monotoneX"
        colors={["#f4634a"]}
        lineWidth={2}
        pointSize={5}
        pointColor="#f4634a"
        pointBorderWidth={2}
        pointBorderColor="#0e0e0f"
        enableArea
        areaOpacity={0.08}
        theme={nivoTheme}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: -35,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          tickValues: [2, 4, 6, 8, 10],
        }}
        gridYValues={[2, 4, 6, 8, 10]}
        useMesh
        tooltip={({ point }) => (
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
            <strong>{String(point.data.x)}</strong>
            <br />
            Intensidad {String(point.data.y)}/10
          </div>
        )}
      />
    </div>
  );
}
