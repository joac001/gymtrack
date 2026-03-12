"use client";

import { useRef, useState } from "react";

interface Props {
  onFile: (file: File) => void;
  loading: boolean;
}

export default function UploadStep({ onFile, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [errorFormato, setErrorFormato] = useState(false);

  function handleFile(file: File) {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setErrorFormato(true);
      return;
    }
    setErrorFormato(false);
    onFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2
          className="text-[1.4rem] m-0 tracking-wider"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
        >
          Subí tu Excel
        </h2>
        <p className="text-[0.85rem] mt-1 mb-0" style={{ color: "var(--text-muted)" }}>
          La IA va a interpretar tu archivo y te va a hacer algunas preguntas antes de importar.
        </p>
      </div>

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => !loading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        disabled={loading}
        className="w-full flex flex-col items-center justify-center gap-3 p-10 cursor-pointer transition-all"
        style={{
          background: dragging ? "var(--push-bg)" : "var(--surface)",
          border: `2px dashed ${dragging ? "var(--push)" : "var(--border)"}`,
          borderRadius: "var(--radius-lg)",
        }}
      >
        <span className="text-4xl">{loading ? "⏳" : "📂"}</span>
        <div className="text-center">
          <p className="text-[0.9rem] font-medium m-0" style={{ color: "var(--text)" }}>
            {loading ? "Analizando con IA..." : "Arrastrá tu archivo acá"}
          </p>
          <p className="text-[0.78rem] m-0 mt-1" style={{ color: "var(--text-muted)" }}>
            {loading ? "Esto puede tomar unos segundos" : "o hacé click para seleccionar · .xlsx / .xls"}
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {errorFormato && (
        <p className="text-[0.85rem] text-center m-0" style={{ color: "#ef4444" }}>
          Solo se aceptan archivos .xlsx o .xls
        </p>
      )}

      {/* Info */}
      <div
        className="flex flex-col gap-2 p-4 text-[0.8rem]"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          color: "var(--text-muted)",
        }}
      >
        <p className="font-semibold m-0" style={{ color: "var(--text)" }}>
          ¿Qué puede contener el Excel?
        </p>
        <ul className="m-0 pl-4 flex flex-col gap-1">
          <li>Rutinas con ejercicios, series y repeticiones</li>
          <li>Historial de entrenamientos con pesos y fechas</li>
          <li>Varios formatos: una sheet por sesión, columnas por día, etc.</li>
          <li>Fechas opcionales — si no hay, te preguntamos desde cuándo</li>
        </ul>
      </div>
    </div>
  );
}
