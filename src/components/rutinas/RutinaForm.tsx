"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const PALETTE = [
  "#f97316", // naranja
  "#3b82f6", // azul
  "#22c55e", // verde
  "#a855f7", // violeta
  "#ec4899", // rosa
  "#14b8a6", // teal
  "#f59e0b", // ámbar
  "#ef4444", // rojo
];

const SUGERENCIAS = [
  "Push",
  "Pull",
  "Legs",
  "Full Body",
  "Upper",
  "Lower",
  "Cardio",
  "Core",
];

const DIAS = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
] as const;
const DIAS_LABEL: Record<string, string> = {
  lunes: "Lun",
  martes: "Mar",
  miercoles: "Mié",
  jueves: "Jue",
  viernes: "Vie",
  sabado: "Sáb",
  domingo: "Dom",
};

interface Ejercicio {
  id: string;
  nombre: string;
  grupo: string;
  tipoMedida: "reps" | "tiempo";
  series: number;
  repsDesde: number;
  repsHasta: string;
  duracion: string;
  notas: string;
}

interface Sesion {
  id: string;
  nombre: string;
  color: string;
  dia: string;
  ejercicios: Ejercicio[];
}

interface Props {
  rutinaId?: string;
  initialData?: {
    nombre: string;
    sesiones: Sesion[];
  };
}

function newEjercicio(): Ejercicio {
  return {
    id: crypto.randomUUID(),
    nombre: "",
    grupo: "",
    tipoMedida: "reps",
    series: 3,
    repsDesde: 10,
    repsHasta: "",
    duracion: "",
    notas: "",
  };
}

function newSesion(index = 0): Sesion {
  return {
    id: crypto.randomUUID(),
    nombre: "",
    color: PALETTE[index % PALETTE.length],
    dia: "lunes",
    ejercicios: [newEjercicio()],
  };
}

// --- Sortable exercise item ---

interface SortableEjercicioProps {
  ej: Ejercicio;
  ei: number;
  sesion: Sesion;
  totalEjercicios: number;
  color: string;
  onUpdate: (field: keyof Ejercicio, value: string | number) => void;
  onRemove: () => void;
}

function SortableEjercicio({
  ej,
  ei,
  sesion,
  totalEjercicios,
  color,
  onUpdate,
  onRemove,
}: SortableEjercicioProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: ej.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: "var(--background)",
    border: isDragging ? `1px solid ${color}80` : "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Grupo muscular */}
      <Input
        list="grupos-rutina"
        placeholder="Grupo muscular (ej: Pecho, Hombros)"
        value={ej.grupo}
        onChange={(e) => onUpdate("grupo", e.target.value)}
        style={{ fontSize: "0.78rem" }}
      />

      {/* Drag handle + nombre + borrar */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "grab",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            touchAction: "none",
          }}
        >
          <GripVertical size={16} />
        </button>

        <span
          style={{
            color: color,
            fontSize: "0.75rem",
            fontWeight: "600",
            minWidth: "20px",
          }}
        >
          {ei + 1}.
        </span>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Nombre del ejercicio"
            value={ej.nombre}
            onChange={(e) => onUpdate("nombre", e.target.value)}
          />
        </div>
        {totalEjercicios > 1 && (
          <button
            type="button"
            onClick={onRemove}
            style={btnIconStyle}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Tipo medida + campos */}
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ flexShrink: 0 }}>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginBottom: "4px",
            }}
          >
            Medida
          </label>
          <select
            value={ej.tipoMedida}
            onChange={(e) => onUpdate("tipoMedida", e.target.value)}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text)",
              fontSize: "0.85rem",
              padding: "8px 10px",
              fontFamily: "inherit",
              cursor: "pointer",
              height: "38px",
            }}
          >
            <option value="reps">Reps</option>
            <option value="tiempo">Minutos</option>
          </select>
        </div>

        {ej.tipoMedida === "reps" ? (
          <>
            <div style={{ flex: 1 }}>
              <Input
                label="Series"
                type="number"
                min={1}
                value={ej.series}
                onChange={(e) => onUpdate("series", Number(e.target.value))}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label="Reps"
                type="number"
                min={1}
                value={ej.repsDesde}
                onChange={(e) => onUpdate("repsDesde", Number(e.target.value))}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label="Hasta (opcional)"
                type="number"
                min={1}
                placeholder="—"
                value={ej.repsHasta}
                onChange={(e) => onUpdate("repsHasta", e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ flex: 1 }}>
              <Input
                label="Series (opcional)"
                type="number"
                min={1}
                placeholder="1"
                value={ej.series > 1 ? ej.series : "1"}
                onChange={(e) =>
                  onUpdate("series", Number(e.target.value) || 1)
                }
              />
            </div>
            <div style={{ flex: 2 }}>
              <Input
                label="Duración"
                placeholder="ej: 10 min"
                value={ej.duracion}
                onChange={(e) => onUpdate("duracion", e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <Input
        placeholder="Notas técnicas (opcional)"
        value={ej.notas}
        onChange={(e) => onUpdate("notas", e.target.value)}
      />
    </div>
  );
}

// --- Main form ---

export default function RutinaForm({ rutinaId, initialData }: Props) {
  const router = useRouter();
  const [nombre, setNombre] = useState(initialData?.nombre ?? "");
  const [sesiones, setSesiones] = useState<Sesion[]>(
    initialData?.sesiones ?? [newSesion(0)],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function addSesion() {
    setSesiones((prev) => [...prev, newSesion(prev.length)]);
  }

  function removeSesion(id: string) {
    setSesiones((prev) => prev.filter((s) => s.id !== id));
  }

  function updateSesion(id: string, field: keyof Sesion, value: string) {
    setSesiones((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  }

  function addEjercicio(sesionId: string) {
    setSesiones((prev) =>
      prev.map((s) =>
        s.id === sesionId
          ? { ...s, ejercicios: [...s.ejercicios, newEjercicio()] }
          : s,
      ),
    );
  }

  function removeEjercicio(sesionId: string, ejId: string) {
    setSesiones((prev) =>
      prev.map((s) =>
        s.id === sesionId
          ? { ...s, ejercicios: s.ejercicios.filter((e) => e.id !== ejId) }
          : s,
      ),
    );
  }

  function updateEjercicio(
    sesionId: string,
    ejId: string,
    field: keyof Ejercicio,
    value: string | number,
  ) {
    setSesiones((prev) =>
      prev.map((s) =>
        s.id === sesionId
          ? {
              ...s,
              ejercicios: s.ejercicios.map((e) =>
                e.id === ejId ? { ...e, [field]: value } : e,
              ),
            }
          : s,
      ),
    );
  }

  function handleDragEnd(sesionId: string, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSesiones((prev) =>
      prev.map((s) => {
        if (s.id !== sesionId) return s;
        const oldIdx = s.ejercicios.findIndex((e) => e.id === active.id);
        const newIdx = s.ejercicios.findIndex((e) => e.id === over.id);
        return { ...s, ejercicios: arrayMove(s.ejercicios, oldIdx, newIdx) };
      }),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      sesiones: sesiones.map((s, si) => ({
        nombre: s.nombre || `Sesión ${si + 1}`,
        color: s.color,
        dia: s.dia,
        orden: si,
        ejercicios: s.ejercicios.map((e, ei) => ({
          nombre: e.nombre,
          grupo: e.grupo || undefined,
          tipoMedida: e.tipoMedida,
          ...(e.tipoMedida === "reps"
            ? {
                series: e.series,
                reps: {
                  desde: e.repsDesde,
                  ...(e.repsHasta !== "" && Number(e.repsHasta) > e.repsDesde
                    ? { hasta: Number(e.repsHasta) }
                    : {}),
                },
              }
            : {
                series: e.series > 1 ? e.series : undefined,
                duracion: e.duracion,
              }),
          notas: e.notas,
          orden: ei,
        })),
      })),
    };

    setLoading(true);
    try {
      const res = await fetch(
        rutinaId ? `/api/routines/${rutinaId}` : "/api/routines",
        {
          method: rutinaId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al guardar");
        return;
      }

      const saved = await res.json();
      router.push(`/rutinas/${saved._id}`);
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      <Input
        label="Nombre de la rutina"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="ej: PPL - Volumen"
        required
      />

      {/* Datalist para autocompletar grupos */}
      <datalist id="grupos-rutina">
        {[...new Set(
          sesiones.flatMap((s) => s.ejercicios.map((e) => e.grupo).filter(Boolean))
        )].map((g) => <option key={g} value={g} />)}
      </datalist>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2
          style={{
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          Sesiones
        </h2>

        {sesiones.map((sesion, _si) => {
          const color = sesion.color;
          return (
            <div
              key={sesion.id}
              style={{
                background: "var(--surface)",
                border: `1px solid ${color}50`,
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
              }}
            >
              {/* Header sesión */}
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Nombre + borrar */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Input
                      placeholder={`Nombre de la sesión (ej: Push A)`}
                      value={sesion.nombre}
                      onChange={(e) =>
                        updateSesion(sesion.id, "nombre", e.target.value)
                      }
                    />
                  </div>
                  {sesiones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSesion(sesion.id)}
                      style={btnIconStyle}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                {/* Sugerencias de nombre */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {SUGERENCIAS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateSesion(sesion.id, "nombre", s)}
                      style={{
                        padding: "3px 10px",
                        borderRadius: "999px",
                        border: `1px solid ${sesion.nombre === s ? color : "var(--border)"}`,
                        background:
                          sesion.nombre === s ? color + "20" : "transparent",
                        color:
                          sesion.nombre === s ? color : "var(--text-muted)",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Color */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      fontWeight: "500",
                    }}
                  >
                    Color
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {PALETTE.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateSesion(sesion.id, "color", c)}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: c,
                          border: "2px solid transparent",
                          cursor: "pointer",
                          padding: 0,
                          flexShrink: 0,
                          outline:
                            sesion.color === c ? `2px solid ${c}` : "none",
                          outlineOffset: "2px",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Día */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {DIAS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => updateSesion(sesion.id, "dia", d)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "var(--radius-sm)",
                        border: `1px solid ${sesion.dia === d ? color : "var(--border)"}`,
                        background:
                          sesion.dia === d ? color + "20" : "transparent",
                        color: sesion.dia === d ? color : "var(--text-muted)",
                        fontSize: "0.78rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {DIAS_LABEL[d]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ejercicios con drag and drop */}
              <div
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Ejercicios
                </p>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => handleDragEnd(sesion.id, event)}
                >
                  <SortableContext
                    items={sesion.ejercicios.map((e) => e.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {sesion.ejercicios.map((ej, ei) => (
                      <SortableEjercicio
                        key={ej.id}
                        ej={ej}
                        ei={ei}
                        sesion={sesion}
                        totalEjercicios={sesion.ejercicios.length}
                        color={color}
                        onUpdate={(field, value) =>
                          updateEjercicio(sesion.id, ej.id, field, value)
                        }
                        onRemove={() => removeEjercicio(sesion.id, ej.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                <button
                  type="button"
                  onClick={() => addEjercicio(sesion.id)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: color + "0d",
                    border: `1px dashed ${color}70`,
                    borderRadius: "var(--radius-md)",
                    color: color,
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  + Ejercicio
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addSesion}
          style={{
            width: "100%",
            padding: "14px",
            background: "transparent",
            border: "2px dashed var(--border)",
            borderRadius: "var(--radius-lg)",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            fontWeight: "500",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          + Agregar sesión
        </button>
      </div>

      {error && (
        <p
          style={{ color: "var(--danger)", fontSize: "0.85rem", textAlign: "center" }}
        >
          {error}
        </p>
      )}

      <Button type="submit" loading={loading}>
        {rutinaId ? "Guardar cambios" : "Crear rutina"}
      </Button>
    </form>
  );
}

const btnIconStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid var(--danger-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--danger)",
  padding: "8px 10px",
  cursor: "pointer",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
