"use client";

import RachaCard from "./RachaCard";
import ConsistenciaChart from "./ConsistenciaChart";
import VolumenChart from "./VolumenChart";
import PesoChart, { EjercicioData } from "./PesoChart";
import IntensidadChart from "./IntensidadChart";
import FrecuenciaChart, { SesionFrecuencia } from "./FrecuenciaChart";

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
        <VolumenChart data={volumenSemanal} />
      </SectionCard>

      {/* Progreso de peso */}
      <SectionCard title="Progreso de peso">
        <PesoChart ejercicios={ejercicios} />
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
    </div>
  );
}
