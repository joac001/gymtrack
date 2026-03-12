/** Factor de conversión kg → lbs */
export const KG_TO_LBS = 2.20462;

/** Convierte kg a la unidad de preferencia del usuario, con decimales razonables */
export function convertirPeso(kg: number, unidad: "kg" | "lbs"): number {
  if (unidad === "lbs") return Math.round(kg * KG_TO_LBS * 10) / 10;
  return kg;
}

/** Formatea un peso con su unidad (ej: "82.5 kg" o "181.9 lbs") */
export function formatPeso(kg: number, unidad: "kg" | "lbs"): string {
  const valor = convertirPeso(kg, unidad);
  // Si el valor es entero, no mostrar decimales
  return valor % 1 === 0 ? `${valor} ${unidad}` : `${valor} ${unidad}`;
}
