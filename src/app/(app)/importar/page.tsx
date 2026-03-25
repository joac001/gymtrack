"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import type {
  PreguntaImport,
  RespuestaRonda,
  RutinaImport,
  LogImport,
  AjusteMenor,
  RondaHistorial,
} from "@/lib/gemini-import";
import UploadStep from "@/components/importar/UploadStep";
import PreguntasStep from "@/components/importar/PreguntasStep";
import ReviewStep from "@/components/importar/ReviewStep";

type Paso = "upload" | "preguntas" | "review" | "exito";

export default function ImportarPage() {
  const { data: session } = useSession();
  const plan = session?.user?.plan === "pro" ? "pro" : "free";
  const router = useRouter();

  const [paso, setPaso] = useState<Paso>("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado acumulado de la conversación
  const [excelBase64, setExcelBase64] = useState<string | null>(null);
  const [historial, setHistorial] = useState<RondaHistorial[]>([]);
  const [ronda, setRonda] = useState(1);

  // Estado del paso preguntas
  const [preguntasActuales, setPreguntasActuales] = useState<PreguntaImport[]>([]);

  // Estado del paso review
  const [rutinas, setRutinas] = useState<RutinaImport[]>([]);
  const [logs, setLogs] = useState<LogImport[]>([]);
  const [ajustes, setAjustes] = useState<AjusteMenor[]>([]);

  // ── Paywall Free ────────────────────────────────────────────────────────
  if (plan !== "pro") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
        <Sparkles size={32} style={{ color: "var(--push)" }} />
        <h2
          className="text-[1.4rem] m-0 tracking-wider"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
        >
          Importar Excel es Pro
        </h2>
        <p className="text-[0.85rem] m-0" style={{ color: "var(--text-muted)" }}>
          Subí tu planilla de Excel y nuestra IA la convierte en rutinas y registros automáticamente.
        </p>
        <Link
          href="/pricing"
          className="text-[0.85rem] font-semibold no-underline px-5 py-2.5 mt-2"
          style={{
            background: "var(--push)",
            color: "#fff",
            borderRadius: "var(--radius-md)",
          }}
        >
          Ver planes →
        </Link>
      </div>
    );
  }

  // ── STEP 1: Upload → llama a /api/import/chat ────────────────────────────

  async function handleUpload(file: File) {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/import/chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Error al analizar el archivo");
      }

      const data = await res.json() as {
        excelBase64: string;
        status: string;
        preguntas?: PreguntaImport[];
        rutinas?: RutinaImport[];
        logs?: LogImport[];
        ajustes?: AjusteMenor[];
      };

      setExcelBase64(data.excelBase64);

      if (data.status === "needs_more_info") {
        setPreguntasActuales(data.preguntas ?? []);
        setRonda(1);
        setPaso("preguntas");
      } else if (data.status === "ready") {
        setRutinas(data.rutinas ?? []);
        setLogs(data.logs ?? []);
        setAjustes(data.ajustes ?? []);
        setPaso("review");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 2/3: Responder preguntas → llama de nuevo a /api/import/chat ────

  async function handleResponder(respuestas: RespuestaRonda[]) {
    if (!excelBase64) return;
    setLoading(true);
    setError(null);

    const nuevaRonda: RondaHistorial = { preguntas: preguntasActuales, respuestas };
    const nuevoHistorial = [...historial, nuevaRonda];
    setHistorial(nuevoHistorial);

    try {
      const formData = new FormData();
      formData.append("excelBase64", excelBase64);
      formData.append("historial", JSON.stringify(nuevoHistorial));

      const res = await fetch("/api/import/chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Error al procesar respuestas");
      }

      const data = await res.json() as {
        excelBase64: string;
        status: string;
        preguntas?: PreguntaImport[];
        rutinas?: RutinaImport[];
        logs?: LogImport[];
        ajustes?: AjusteMenor[];
      };

      if (data.status === "needs_more_info") {
        setPreguntasActuales(data.preguntas ?? []);
        setRonda((r) => r + 1);
        // (el paso sigue siendo "preguntas")
      } else if (data.status === "ready") {
        setRutinas(data.rutinas ?? []);
        setLogs(data.logs ?? []);
        setAjustes(data.ajustes ?? []);
        setPaso("review");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 4: Confirmar importación ────────────────────────────────────────

  async function handleConfirmar(ajustesValores: Record<string, string | number | boolean>) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/import/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rutinas, logs, ajustes: ajustesValores }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Error al importar");
      }

      setPaso("exito");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto">
      {/* Back */}
      {paso !== "exito" && (
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[0.85rem] text-left"
          style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          ← Volver
        </button>
      )}

      {/* Error global */}
      {error && (
        <div
          className="px-4 py-3 text-[0.85rem]"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "var(--radius-md)",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      {/* Steps */}
      {paso === "upload" && (
        <UploadStep onFile={handleUpload} loading={loading} />
      )}

      {paso === "preguntas" && (
        <PreguntasStep
          preguntas={preguntasActuales}
          ronda={ronda}
          onResponder={handleResponder}
          loading={loading}
        />
      )}

      {paso === "review" && (
        <ReviewStep
          rutinas={rutinas}
          logs={logs}
          ajustes={ajustes}
          onConfirmar={handleConfirmar}
          loading={loading}
        />
      )}

      {paso === "exito" && (
        <div className="flex flex-col gap-6 items-center text-center py-8">
          <div className="text-[3rem]">✅</div>
          <div>
            <h2
              className="text-[1.6rem] m-0 tracking-wider"
              style={{ fontFamily: "var(--font-bebas)", color: "var(--text)" }}
            >
              Importación completada
            </h2>
            <p className="text-[0.9rem] mt-2 mb-0" style={{ color: "var(--text-muted)" }}>
              {rutinas.length > 0 && `${rutinas.length} rutina${rutinas.length !== 1 ? "s" : ""} creada${rutinas.length !== 1 ? "s" : ""}. `}
              {logs.length > 0 && `${logs.length} entrenamiento${logs.length !== 1 ? "s" : ""} importado${logs.length !== 1 ? "s" : ""}.`}
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <button
              type="button"
              onClick={() => router.push("/rutinas")}
              className="w-full py-3.5 text-[0.9rem] font-bold uppercase tracking-wider cursor-pointer"
              style={{
                background: "var(--push)",
                border: "none",
                borderRadius: "var(--radius-lg)",
                color: "#fff",
                fontFamily: "var(--font-bebas)",
                fontSize: "1rem",
              }}
            >
              Ver mis rutinas →
            </button>
            <button
              type="button"
              onClick={() => router.push("/historial")}
              className="w-full py-3 text-[0.85rem] font-semibold cursor-pointer"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                color: "var(--text-muted)",
              }}
            >
              Ver historial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
