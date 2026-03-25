"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGERENCIAS = [
  "¿Cómo viene mi progreso?",
  "¿Qué ejercicio mejoré más?",
  "¿Debería hacer un deload?",
  "¿Cómo equilibro mi rutina?",
];

export default function ChatWidget({ plan }: { plan: "free" | "pro" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  async function enviar(texto?: string) {
    const pregunta = (texto ?? input).trim();
    if (!pregunta || loading) return;

    const nuevosMensajes: Message[] = [
      ...messages,
      { role: "user", content: pregunta },
    ];
    setMessages(nuevosMensajes);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pregunta,
          historial: nuevosMensajes.slice(0, -1), // sin la pregunta actual
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al enviar");
      }

      const { respuesta } = await res.json();
      setMessages([...nuevosMensajes, { role: "assistant", content: respuesta }]);
    } catch (err) {
      setMessages([
        ...nuevosMensajes,
        {
          role: "assistant",
          content: `Error: ${err instanceof Error ? err.message : "No se pudo conectar"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // FAB (botón flotante)
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 flex items-center justify-center rounded-full shadow-lg cursor-pointer"
        style={{
          width: 56,
          height: 56,
          background: "var(--push)",
          border: "none",
          color: "#fff",
        }}
        aria-label="Abrir chat IA"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-0 right-0 z-50 flex flex-col sm:bottom-4 sm:right-4"
      style={{
        width: "100%",
        maxWidth: 400,
        height: "min(70vh, 520px)",
        background: "var(--background)",
        border: "1px solid var(--border)",
        borderRadius: "0",
        overflow: "hidden",
      }}
      // Desktop: rounded
      data-chat-panel=""
    >
      <style>{`
        @media (min-width: 640px) {
          [data-chat-panel] {
            border-radius: var(--radius-lg) !important;
          }
        }
      `}</style>

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: "var(--push)" }} />
          <span
            className="text-[0.9rem] font-semibold"
            style={{ color: "var(--text)" }}
          >
            Coach IA
          </span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="flex items-center justify-center cursor-pointer"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            padding: 4,
          }}
          aria-label="Cerrar chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Paywall para free */}
      {plan === "free" ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <Sparkles size={32} style={{ color: "var(--push)" }} />
          <p
            className="text-[0.95rem] font-semibold m-0"
            style={{ color: "var(--text)" }}
          >
            Coach IA disponible en Pro
          </p>
          <p
            className="text-[0.8rem] m-0"
            style={{ color: "var(--text-muted)" }}
          >
            Preguntale a tu coach personalizado sobre tu rutina, progreso y
            recomendaciones.
          </p>
          <Link
            href="/pricing"
            className="text-[0.85rem] font-semibold no-underline px-5 py-2.5"
            style={{
              background: "var(--push)",
              color: "#fff",
              borderRadius: "var(--radius-md)",
            }}
          >
            Ver planes →
          </Link>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
            style={{ minHeight: 0 }}
          >
            {messages.length === 0 && !loading && (
              <div className="flex flex-col gap-2 mt-auto">
                <p
                  className="text-[0.8rem] mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Preguntame sobre tu entrenamiento:
                </p>
                {SUGERENCIAS.map((s) => (
                  <button
                    key={s}
                    onClick={() => enviar(s)}
                    className="text-left text-[0.8rem] px-3 py-2 cursor-pointer"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 text-[0.84rem] leading-relaxed ${
                  msg.role === "user" ? "self-end whitespace-pre-wrap" : "self-start chat-markdown"
                }`}
                style={{
                  background:
                    msg.role === "user"
                      ? "var(--push)"
                      : "var(--surface)",
                  color:
                    msg.role === "user" ? "#fff" : "var(--text)",
                  borderRadius:
                    msg.role === "user"
                      ? "var(--radius-md) var(--radius-md) 4px var(--radius-md)"
                      : "var(--radius-md) var(--radius-md) var(--radius-md) 4px",
                }}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <Markdown>{msg.content}</Markdown>
                )}
              </div>
            ))}

            {loading && (
              <div
                className="self-start flex items-center gap-2 px-3 py-2 text-[0.8rem]"
                style={{
                  background: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-muted)",
                }}
              >
                <Loader2 size={14} className="animate-spin" />
                Pensando...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="shrink-0 flex items-center gap-2 px-3 py-2.5"
            style={{
              borderTop: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  enviar();
                }
              }}
              placeholder="Preguntá algo..."
              maxLength={500}
              disabled={loading}
              className="flex-1 text-[0.85rem] px-3 py-2 outline-none"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text)",
              }}
            />
            <button
              onClick={() => enviar()}
              disabled={!input.trim() || loading}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 36,
                height: 36,
                background:
                  input.trim() && !loading ? "var(--push)" : "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: input.trim() && !loading ? "#fff" : "var(--text-muted)",
                opacity: input.trim() && !loading ? 1 : 0.5,
              }}
              aria-label="Enviar"
            >
              <Send size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
