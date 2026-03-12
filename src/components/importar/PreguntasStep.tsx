"use client";

import { useState } from "react";
import type { PreguntaImport, RespuestaRonda } from "@/lib/gemini-import";

interface Props {
  preguntas: PreguntaImport[];
  ronda: number; // 1 o 2
  onResponder: (respuestas: RespuestaRonda[]) => void;
  loading: boolean;
}

export default function PreguntasStep({ preguntas, ronda, onResponder, loading }: Props) {
  const [valores, setValores] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const p of preguntas) {
      init[p.id] = p.valorSugerido != null ? String(p.valorSugerido) : "";
    }
    return init;
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const respuestas: RespuestaRonda[] = preguntas.map((p) => ({
      preguntaId: p.id,
      respuesta: valores[p.id] ?? "",
    }));
    onResponder(respuestas);
  }

  const todoCompleto = preguntas.every((p) => (valores[p.id] ?? "").trim() !== "");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-wider m-0 mb-1" style={{ color: "var(--push)" }}>
          Ronda {ronda} de preguntas
        </p>
        <h2
          className="text-[1.4rem] m-0 tracking-wider"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
        >
          Necesito un poco más de info
        </h2>
        <p className="text-[0.85rem] mt-1 mb-0" style={{ color: "var(--text-muted)" }}>
          La IA detectó algunas cosas que necesita confirmar antes de continuar.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {preguntas.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-2 p-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <label
              htmlFor={p.id}
              className="text-[0.9rem] font-medium"
              style={{ color: "var(--text)" }}
            >
              {p.pregunta}
            </label>

            {p.tipo === "select" && p.opciones ? (
              <div className="flex gap-2 flex-wrap">
                {p.opciones.map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setValores((v) => ({ ...v, [p.id]: op }))}
                    className="px-4 py-2 text-[0.85rem] font-medium cursor-pointer transition-all"
                    style={{
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${valores[p.id] === op ? "var(--push)" : "var(--border)"}`,
                      background: valores[p.id] === op ? "var(--push-bg)" : "transparent",
                      color: valores[p.id] === op ? "var(--push)" : "var(--text)",
                    }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            ) : p.tipo === "boolean" ? (
              <div className="flex gap-2">
                {["Sí", "No"].map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setValores((v) => ({ ...v, [p.id]: op }))}
                    className="px-4 py-2 text-[0.85rem] font-medium cursor-pointer transition-all"
                    style={{
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${valores[p.id] === op ? "var(--push)" : "var(--border)"}`,
                      background: valores[p.id] === op ? "var(--push-bg)" : "transparent",
                      color: valores[p.id] === op ? "var(--push)" : "var(--text)",
                    }}
                  >
                    {op}
                  </button>
                ))}
              </div>
            ) : (
              <input
                id={p.id}
                type={p.tipo === "date" ? "date" : p.tipo === "number" ? "number" : "text"}
                value={valores[p.id] ?? ""}
                onChange={(e) => setValores((v) => ({ ...v, [p.id]: e.target.value }))}
                min={p.tipo === "number" ? 1 : undefined}
                max={p.tipo === "number" ? 10 : undefined}
                className="w-full px-3 py-2.5 text-[0.9rem] outline-none transition-all"
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={!todoCompleto || loading}
        className="w-full py-3.5 text-[0.9rem] font-bold uppercase tracking-wider cursor-pointer transition-all disabled:opacity-40"
        style={{
          background: "var(--push)",
          border: "none",
          borderRadius: "var(--radius-lg)",
          color: "#fff",
          fontFamily: "var(--font-bebas)",
          fontSize: "1rem",
        }}
      >
        {loading ? "Procesando..." : "Continuar →"}
      </button>
    </form>
  );
}
