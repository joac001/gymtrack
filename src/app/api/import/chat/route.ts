import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { parseExcel, sheetsToText } from "@/lib/excel-parser";
import { callGeminiImport, type RondaHistorial } from "@/lib/gemini-import";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    // El Excel se pasa como base64 en rondas 2 y 3 (para no re-subir el archivo)
    // En la primera ronda llega como archivo binario
    const file = formData.get("file") as File | null;
    const excelBase64 = formData.get("excelBase64") as string | null;
    const historialRaw = formData.get("historial") as string | null;

    const historial: RondaHistorial[] = historialRaw ? JSON.parse(historialRaw) : [];

    let excelText: string;

    if (file) {
      // Primera ronda: archivo recibido directo
      const sheets = await parseExcel(await file.arrayBuffer());
      excelText = sheetsToText(sheets);
    } else if (excelBase64) {
      // Rondas 2 y 3: el cliente re-envía el texto ya procesado
      excelText = Buffer.from(excelBase64, "base64").toString("utf-8");
    } else {
      return NextResponse.json({ error: "Falta el archivo Excel" }, { status: 400 });
    }

    // Verificar límite de rondas (máximo 3)
    if (historial.length >= 3) {
      return NextResponse.json(
        { error: "Se alcanzó el límite de 3 rondas de conversación" },
        { status: 400 },
      );
    }

    const resultado = await callGeminiImport(excelText, historial);

    // Devolver también el excelText codificado para que el cliente lo reuse en próximas rondas
    const excelBase64Out = Buffer.from(excelText, "utf-8").toString("base64");

    return NextResponse.json({ ...resultado, excelBase64: excelBase64Out });
  } catch (error) {
    console.error("[import/chat] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al procesar el archivo" },
      { status: 500 },
    );
  }
}
