"use client";

import { useState } from "react";
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

const MESES_ES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function formatDayEs(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Devuelve el primer lunes >= Jan 1 del año dado.
 * Siempre cae dentro del mismo año (Jan 1–7), evitando que nivo
 * interprete la semana como perteneciente al año anterior.
 */
function primerLunesDelAnio(year: number): string {
  const jan1DayOfWeek = new Date(year, 0, 1).getDay(); // 0=Dom, 1=Lun, …, 6=Sáb
  // Si Jan 1 ya es lunes (1) → día 1; si es Dom (0) → día 2; resto → avanzar hasta el próximo lunes
  const daysToAdd = jan1DayOfWeek === 1 ? 0 : jan1DayOfWeek === 0 ? 1 : 8 - jan1DayOfWeek;
  const day = 1 + daysToAdd; // siempre entre 1 y 7 → mismo año
  return `${year}-01-${String(day).padStart(2, "0")}`;
}

interface YearCalendarProps {
  year: number;
  data: { day: string; value: number }[];
  toDate: string;
}

function YearCalendar({ year, data, toDate }: YearCalendarProps) {
  const yearData = data.filter((d) => d.day.startsWith(String(year)));
  const from = primerLunesDelAnio(year);
  // Para el año actual mostramos hasta hoy; para años pasados el año completo
  const to = toDate.startsWith(String(year)) ? toDate : `${year}-12-31`;

  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[0.78rem] font-semibold"
        style={{ color: "var(--text-muted)" }}
      >
        {year}
      </span>
      <div style={{ height: 110 }}>
        <ResponsiveCalendar
          data={yearData}
          from={from}
          to={to}
          emptyColor="#1e1e20"
          colors={["#f4634a40", "#f4634a80", "#f4634ac0", "#f4634a"]}
          margin={{ top: 20, right: 8, bottom: 0, left: 4 }}
          yearSpacing={0}
          monthBorderColor="transparent"
          dayBorderWidth={2}
          dayBorderColor="#0e0e0f"
          monthLegend={(_, month) => MESES_ES[month]}
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
              <strong>{formatDayEs(day)}</strong>
              {Number(value) > 0 && " · entrenado"}
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default function ConsistenciaChart({ data, desde, hasta }: Props) {
  const [showAll, setShowAll] = useState(false);

  const fromYear = parseInt(desde.split("-")[0]);
  const toYear   = parseInt(hasta.split("-")[0]);

  const allYears: number[] = [];
  for (let y = fromYear; y <= toYear; y++) allYears.push(y);

  // Por defecto solo el año más reciente; "Ver más" expande los anteriores
  const currentYear = allYears[allYears.length - 1];
  const olderYears  = allYears.slice(0, -1);

  return (
    <div className="flex flex-col gap-4">
      {/* Años anteriores — solo visibles tras "Ver más" */}
      {showAll && olderYears.map((year) => (
        <YearCalendar key={year} year={year} data={data} toDate={hasta} />
      ))}

      {/* Año actual — siempre visible */}
      <YearCalendar year={currentYear} data={data} toDate={hasta} />

      {/* Botón "Ver más" si hay años anteriores */}
      {!showAll && olderYears.length > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="text-[0.78rem] mx-auto px-4 py-1.5 cursor-pointer"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-muted)",
            background: "transparent",
          }}
        >
          Ver {olderYears.length} año{olderYears.length > 1 ? "s" : ""} anterior{olderYears.length > 1 ? "es" : ""}
        </button>
      )}
    </div>
  );
}
