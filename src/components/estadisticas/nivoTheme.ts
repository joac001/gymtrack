// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nivoTheme: any = {
  background: "transparent",
  text: {
    fontSize: 11,
    fill: "#6b6b72",
    fontFamily: "var(--font-dm-sans, sans-serif)",
  },
  axis: {
    domain: { line: { stroke: "#252527", strokeWidth: 1 } },
    legend: { text: { fontSize: 11, fill: "#6b6b72" } },
    ticks: {
      line: { stroke: "#252527", strokeWidth: 1 },
      text: { fontSize: 10, fill: "#6b6b72" },
    },
  },
  grid: {
    line: { stroke: "#252527", strokeWidth: 1 },
  },
  legends: {
    text: { fontSize: 11, fill: "#6b6b72" },
  },
  tooltip: {
    container: {
      background: "#161617",
      border: "1px solid #252527",
      borderRadius: "8px",
      padding: "8px 12px",
      fontSize: "12px",
      color: "#e8e8e8",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    },
  },
  crosshair: {
    line: { stroke: "#6b6b72", strokeWidth: 1, strokeOpacity: 0.5 },
  },
};
