"use client";

import { useState } from "react";
import Link from "next/link";

const DIAS_ORDER = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
] as const;

const DIAS_SHORT: Record<string, string> = {
  domingo: "Do",
  lunes: "Lu",
  martes: "Ma",
  miercoles: "Mi",
  jueves: "Ju",
  viernes: "Vi",
  sabado: "Sá",
};

const DIAS_LABEL: Record<string, string> = {
  domingo: "Domingo",
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
};

export interface SesionResumen {
  id: string;
  nombre: string;
  color: string;
  dia: string;
  ejerciciosCount: number;
  ejerciciosPreview: string[];
}

interface Props {
  sesiones: SesionResumen[];
  rutinaId: string;
  today: string;
}

export default function WeekCalendar({ sesiones, rutinaId, today }: Props) {
  const [selectedDay, setSelectedDay] = useState(today);

  const sesionPorDia = new Map<string, SesionResumen[]>();
  for (const s of sesiones) {
    if (!sesionPorDia.has(s.dia)) sesionPorDia.set(s.dia, []);
    sesionPorDia.get(s.dia)!.push(s);
  }

  const sesionesHoy = sesionPorDia.get(selectedDay) ?? [];
  const colorDia = sesionesHoy.length > 0 ? sesionesHoy[0].color : "var(--push)";

  return (
    <div className="flex flex-col gap-4">
      {/* Strip de días */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DIAS_ORDER.map((dia) => {
          const sesDia = sesionPorDia.get(dia) ?? [];
          const isToday = dia === today;
          const isSelected = dia === selectedDay;
          const hasSesion = sesDia.length > 0;
          const btnColor = hasSesion ? sesDia[0].color : "var(--push)";

          return (
            <button
              key={dia}
              type="button"
              onClick={() => setSelectedDay(dia)}
              className="flex flex-col items-center gap-1.5 px-2.5 py-2 shrink-0 min-w-[44px] cursor-pointer transition-all duration-[120ms]"
              style={{
                borderRadius: "var(--radius-md)",
                border: isSelected
                  ? `1.5px solid ${btnColor}`
                  : isToday
                    ? "1.5px solid var(--push)"
                    : "1.5px solid var(--border)",
                background: isSelected
                  ? hasSesion
                    ? btnColor + "18"
                    : "var(--push-bg)"
                  : "transparent",
              }}
            >
              <span
                className="text-[0.8rem] leading-none"
                style={{
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected
                    ? hasSesion
                      ? btnColor
                      : "var(--push)"
                    : isToday
                      ? "var(--push)"
                      : "var(--text-muted)",
                }}
              >
                {DIAS_SHORT[dia]}
              </span>
              {/* Punto: solo si hay sesión */}
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: hasSesion ? sesDia[0].color + "80" : "transparent" }}
              />
            </button>
          );
        })}
      </div>

      {/* Card de sesión del día seleccionado */}
      {sesionesHoy.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {sesionesHoy.map((sesion) => (
            <div
              key={sesion.id}
              className="overflow-hidden"
              style={{
                background: "var(--surface)",
                border: `1px solid ${sesion.color}40`,
                borderRadius: "var(--radius-lg)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3.5"
                style={{
                  background: sesion.color + "14",
                  borderBottom: `1px solid ${sesion.color}30`,
                }}
              >
                <div>
                  <h3
                    className="m-0 text-[1.4rem] tracking-wider"
                    style={{
                      fontFamily: "var(--font-bebas)",
                      color: sesion.color,
                    }}
                  >
                    {sesion.nombre.toUpperCase()}
                  </h3>
                  <span className="text-[0.8rem]" style={{ color: "var(--text-muted)" }}>
                    {sesion.ejerciciosCount} ejercicios · {DIAS_LABEL[selectedDay]}
                    {selectedDay !== today && (
                      <span
                        className="ml-1.5 text-[0.72rem] font-semibold"
                        style={{ color: "var(--push)" }}
                      >
                        (hoy es {DIAS_LABEL[today]})
                      </span>
                    )}
                  </span>
                </div>
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: sesion.color }}
                />
              </div>

              {/* Preview + botón */}
              <div className="px-4 py-3.5">
                {sesion.ejerciciosPreview.length > 0 && (
                  <p
                    className="text-[0.8rem] mb-3.5 leading-relaxed m-0"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {sesion.ejerciciosPreview.join(" · ")}
                    {sesion.ejerciciosCount > sesion.ejerciciosPreview.length &&
                      ` · +${sesion.ejerciciosCount - sesion.ejerciciosPreview.length} más`}
                  </p>
                )}
                <Link
                  href={`/entrenar/${sesion.id}?rutinaId=${rutinaId}`}
                  className="block w-full py-3.5 text-center font-bold text-base no-underline tracking-wider"
                  style={{
                    background: sesion.color,
                    borderRadius: "var(--radius-md)",
                    color: "#fff",
                    fontFamily: "var(--font-bebas)",
                  }}
                >
                  EMPEZAR SESIÓN
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="p-6 text-center"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <p className="font-semibold m-0 mb-1" style={{ color: "var(--text)" }}>
            Descanso · {DIAS_LABEL[selectedDay]}
          </p>
          <p className="text-[0.82rem] m-0" style={{ color: "var(--text-muted)" }}>
            No hay sesión programada para este día.
          </p>
        </div>
      )}
    </div>
  );
}
