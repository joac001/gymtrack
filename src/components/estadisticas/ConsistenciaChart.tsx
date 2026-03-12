"use client";

import dynamic from "next/dynamic";
import { nivoTheme } from "./nivoTheme";

const ResponsiveCalendar = dynamic(
  () => import("@nivo/calendar").then((m) => m.ResponsiveCalendar),
  { ssr: false }
);

interface Props {
  data: { day: string; value: number }[];
  desde: string;
  hasta: string;
}

export default function ConsistenciaChart({ data, desde, hasta }: Props) {
  return (
    <div style={{ height: 140 }}>
      <ResponsiveCalendar
        data={data}
        from={desde}
        to={hasta}
        emptyColor="#1e1e20"
        colors={["#f4634a40", "#f4634a80", "#f4634ac0", "#f4634a"]}
        margin={{ top: 20, right: 20, bottom: 0, left: 24 }}
        yearSpacing={40}
        monthBorderColor="transparent"
        dayBorderWidth={2}
        dayBorderColor="#0e0e0f"
        theme={nivoTheme}
        tooltip={({ day, value }) => (
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
            <strong>{day}</strong>
            {Number(value) > 0 && " · entrenado"}
          </div>
        )}
      />
    </div>
  );
}
