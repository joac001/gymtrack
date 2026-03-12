import ExcelJS from "exceljs";

export interface SheetData {
  nombre: string;
  filas: string[][];
}

/**
 * Convierte un buffer de .xlsx en una representación de texto por sheet.
 * Cada celda se convierte a string. Las celdas vacías se representan como "".
 * Se excluyen sheets totalmente vacíos.
 */
export async function parseExcel(buffer: ArrayBuffer): Promise<SheetData[]> {
  const workbook = new ExcelJS.Workbook();
  // ExcelJS espera Buffer; el cast es seguro en runtime (Node.js ArrayBuffer ↔ Buffer)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await workbook.xlsx.load(buffer as unknown as any);

  const sheets: SheetData[] = [];

  workbook.eachSheet((sheet) => {
    const filas: string[][] = [];

    sheet.eachRow({ includeEmpty: false }, (row) => {
      const celdas: string[] = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        // Resolver fórmulas al valor calculado si está disponible
        let valor = "";
        if (cell.type === ExcelJS.ValueType.Formula) {
          valor = String(cell.result ?? "");
        } else if (cell.value !== null && cell.value !== undefined) {
          valor = String(cell.value);
        }
        celdas.push(valor.trim());
      });

      // Solo agregar filas que tengan al menos un valor no vacío
      if (celdas.some((c) => c !== "")) {
        filas.push(celdas);
      }
    });

    if (filas.length > 0) {
      sheets.push({ nombre: sheet.name, filas });
    }
  });

  return sheets;
}

/**
 * Serializa las sheets a texto plano para enviar a Gemini.
 * Formato: tabla marcada con el nombre de la sheet.
 */
export function sheetsToText(sheets: SheetData[]): string {
  return sheets
    .map((s) => {
      const header = `=== SHEET: "${s.nombre}" ===`;
      const rows = s.filas.map((fila) => fila.join("\t")).join("\n");
      return `${header}\n${rows}`;
    })
    .join("\n\n");
}
