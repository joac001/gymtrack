"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import RachaCard from "./RachaCard";
import ConsistenciaChart from "./ConsistenciaChart";
import VolumenChart from "./VolumenChart";
import PesoChart, { EjercicioData } from "./PesoChart";
import IntensidadChart from "./IntensidadChart";
import FrecuenciaChart, { SesionFrecuencia } from "./FrecuenciaChart";
import BalanceChart from "./BalanceChart";
import UnRMChart from "./UnRMChart";
import PlateauList from "./PlateauList";
import MusculoRadarChart from "./MusculoRadarChart";
import ProPaywall from "@/components/ui/ProPaywall";

export interface BalanceSesion {
  sesion: string;
  color: string;
  volumen: number;
}

export interface PlateauData {
  ejercicio: string;
  semanas: number;
  ultimoPeso: number;
}

export interface MusculoData {
  musculo: string;
  volumen: number;
}

interface Props {
  rachaActual: number;
  rachaMaxima: number;
  totalEntrenamientos: number;
  totalSemanas: number;
  consistencia: { day: string; value: number }[];
  consistenciaDesde: string;
  consistenciaHasta: string;
  volumenSemanal: { semana: string; volumen: number }[];
  ejercicios: EjercicioData[];
  intensidad: { x: string; y: number }[];
  frecuencia: SesionFrecuencia[];
  unidadPeso?: "kg" | "lbs";
  plan?: "free" | "pro";
  balanceSesiones: BalanceSesion[];
  unRmEjercicios: EjercicioData[];
  plateaus: PlateauData[];
  musculoData: MusculoData[];
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-4 p-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <h2
        className="text-[1.1rem] font-semibold m-0"
        style={{ color: "var(--text)" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function ExportarDatosBtn(props: Omit<Props, "unidadPeso"> & { unidadPeso: "kg" | "lbs" }) {
  const [copiado, setCopiado] = useState(false);

  function copiar() {
    const payload = {
      unidadPeso: props.unidadPeso,
      volumenSemanal: props.volumenSemanal,
      progresoPeso: props.ejercicios.map((e) => ({
        ejercicio: e.nombre,
        datos: e.datos,
      })),
      balanceSesiones: props.balanceSesiones,
      unRmEstimado: props.unRmEjercicios.map((e) => ({
        ejercicio: e.nombre,
        datos: e.datos,
      })),
      plateaus: props.plateaus,
      distribucionMuscular: props.musculoData,
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    });
  }

  return (
    <button
      onClick={copiar}
      className="flex items-center gap-2 text-[0.78rem] px-3 py-1.5 mx-auto cursor-pointer"
      style={{
        background: "transparent",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        color: copiado ? "#22c55e" : "var(--text-muted)",
        transition: "color 0.2s",
      }}
    >
      {copiado ? <Check size={13} /> : <Copy size={13} />}
      {copiado ? "Copiado" : "Exportar datos de gráficos"}
    </button>
  );
}

export default function StatsPageClient({
  rachaActual,
  rachaMaxima,
  totalEntrenamientos,
  totalSemanas,
  consistencia,
  consistenciaDesde,
  consistenciaHasta,
  volumenSemanal,
  ejercicios,
  intensidad,
  frecuencia,
  unidadPeso = "kg",
  plan = "free",
  balanceSesiones,
  unRmEjercicios,
  plateaus,
  musculoData,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Stat cards */}
      <RachaCard
        rachaActual={rachaActual}
        rachaMaxima={rachaMaxima}
        totalEntrenamientos={totalEntrenamientos}
        totalSemanas={totalSemanas}
      />

      {/* Heatmap de consistencia */}
      <SectionCard title="Consistencia">
        <ConsistenciaChart
          data={consistencia}
          desde={consistenciaDesde}
          hasta={consistenciaHasta}
        />
      </SectionCard>

      {/* Volumen semanal */}
      <SectionCard title="Volumen semanal">
        <VolumenChart data={volumenSemanal} unidadPeso={unidadPeso} />
      </SectionCard>

      {/* Progreso de peso */}
      <SectionCard title="Progreso de peso">
        <PesoChart ejercicios={ejercicios} unidadPeso={unidadPeso} />
      </SectionCard>

      {/* Intensidad + Frecuencia en grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard title="Intensidad percibida">
          <IntensidadChart data={intensidad} />
        </SectionCard>

        <SectionCard title="Sesiones más entrenadas">
          <FrecuenciaChart data={frecuencia} />
        </SectionCard>
      </div>

      {/* ── Separador de estadísticas avanzadas ─────────────────────────── */}
      <div className="flex items-center gap-3 pt-2">
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span
          className="text-[0.7rem] font-semibold tracking-widest uppercase px-2 py-0.5"
          style={{
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            borderRadius: "999px",
          }}
        >
          Análisis avanzado
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      {/* Balance por sesión */}
      {plan === "pro" ? (
        <SectionCard title="Balance de volumen por sesión">
          <BalanceChart data={balanceSesiones} unidadPeso={unidadPeso} />
        </SectionCard>
      ) : (
        <ProPaywall title="Balance de volumen">
          <SectionCard title="Balance de volumen por sesión">
            <BalanceChart data={balanceSesiones} unidadPeso={unidadPeso} />
          </SectionCard>
        </ProPaywall>
      )}

      {/* 1RM estimado */}
      {plan === "pro" ? (
        <SectionCard title="1RM estimado">
          <UnRMChart ejercicios={unRmEjercicios} unidadPeso={unidadPeso} />
        </SectionCard>
      ) : (
        <ProPaywall title="1RM estimado">
          <SectionCard title="1RM estimado">
            <UnRMChart ejercicios={unRmEjercicios} unidadPeso={unidadPeso} />
          </SectionCard>
        </ProPaywall>
      )}

      {/* Plateau */}
      {plateaus.length > 0 && (
        plan === "pro" ? (
          <SectionCard title="Ejercicios estancados">
            <PlateauList plateaus={plateaus} unidadPeso={unidadPeso} />
          </SectionCard>
        ) : (
          <ProPaywall title="Ejercicios estancados">
            <SectionCard title="Ejercicios estancados">
              <PlateauList plateaus={plateaus} unidadPeso={unidadPeso} />
            </SectionCard>
          </ProPaywall>
        )
      )}

      {/* Distribución muscular */}
      {musculoData.length >= 3 && (
        plan === "pro" ? (
          <SectionCard title="Distribución muscular">
            <MusculoRadarChart data={musculoData} unidadPeso={unidadPeso} />
          </SectionCard>
        ) : (
          <ProPaywall title="Distribución muscular">
            <SectionCard title="Distribución muscular">
              <MusculoRadarChart data={musculoData} unidadPeso={unidadPeso} />
            </SectionCard>
          </ProPaywall>
        )
      )}

      {/* Botón de debug */}
      <ExportarDatosBtn
        rachaActual={rachaActual}
        rachaMaxima={rachaMaxima}
        totalEntrenamientos={totalEntrenamientos}
        totalSemanas={totalSemanas}
        consistencia={consistencia}
        consistenciaDesde={consistenciaDesde}
        consistenciaHasta={consistenciaHasta}
        volumenSemanal={volumenSemanal}
        ejercicios={ejercicios}
        intensidad={intensidad}
        frecuencia={frecuencia}
        unidadPeso={unidadPeso}
        balanceSesiones={balanceSesiones}
        unRmEjercicios={unRmEjercicios}
        plateaus={plateaus}
        musculoData={musculoData}
      />
    </div>
  );
}
