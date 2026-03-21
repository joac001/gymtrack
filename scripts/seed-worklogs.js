/**
 * Seed WorkoutLogs — PPL Volumen (01 Ene 2026 → 12 Mar 2026)
 *
 * Uso en mongosh:
 *   1. Conectate a tu base:  mongosh "mongodb+srv://..."
 *   2. Seleccioná la base:   use gymtrack-dev   (o el nombre que uses)
 *   3. Ejecutá el script:    load("scripts/seed-worklogs.js")
 *
 * O pegá el contenido directamente en la consola de mongosh.
 *
 * IMPORTANTE: borra TODOS los worklogs del usuario antes de insertar.
 */

// ─────────────────────────────────────────────────────────────────────────────
const USER_ID = ""; // => userId del usuario al que quieras asignar los logs
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Obtener rutina activa ──────────────────────────────────────────────────
const rutina = db.routines.findOne({ userId: USER_ID, activa: true });
if (!rutina) {
  print("❌  No se encontró rutina activa para el usuario.");
  quit(1);
}
print("✔  Rutina: " + rutina.nombre + "  (" + rutina._id + ")");

const rutinaId = rutina._id;

// ── 2. Mapas de IDs por sesión (evita conflictos de nombre entre sesiones) ────
const sesMap = {}; // nombre → { id, color }
const ejMap = {};  // sesionNombre → { ejercicioNombre → _id }

for (const s of rutina.sesiones) {
  sesMap[s.nombre] = { id: s._id, color: s.color };
  ejMap[s.nombre] = {};
  for (const e of s.ejercicios) {
    ejMap[s.nombre][e.nombre] = e._id;
  }
}

function sId(ses)       { return sesMap[ses].id; }
function sColor(ses)    { return sesMap[ses].color; }
function eId(ses, ej)   { return ejMap[ses][ej]; }

// ── 3. Helpers ────────────────────────────────────────────────────────────────
function sets(n, reps, peso) {
  return Array.from({ length: n }, () => ({ reps: reps, peso: peso }));
}
function d(y, m, day) {
  return new Date(Date.UTC(y, m - 1, day, 10, 0, 0));
}

// ── 4. Tablas de pesos progresivos ────────────────────────────────────────────
//
// PUSH (9 sesiones)
// Cols: [pressBanca, pressIncl, aperturas, presMilitar, elevLat, tricepsPolea, pressFrances]
const WP = [
  [60,   50,   40,   42.5, 10, 22.5, 30  ], // P1 — Sem 1
  [60,   50,   40,   42.5, 10, 22.5, 30  ], // P2 — Sem 2
  [60,   50,   42.5, 42.5, 10, 22.5, 30  ], // P3 — Sem 3
  [62.5, 52.5, 42.5, 45,   10, 25,   32.5], // P4 — Sem 4 (1 día)
  [62.5, 52.5, 42.5, 45,   12, 25,   32.5], // P5 — Sem 5
  [62.5, 52.5, 45,   45,   12, 25,   32.5], // P6 — Sem 6
  [65,   55,   45,   47.5, 12, 27.5, 35  ], // P7 — Sem 7
  [65,   55,   45,   47.5, 12, 27.5, 35  ], // P8 — Sem 9
  [67.5, 57.5, 47.5, 47.5, 14, 27.5, 35  ], // P9 — Sem 10
];

// PULL (9 sesiones)
// Cols: [jalon, remoPolea, remoManc, facePulls, curlBarra, curlMart]
// ⚠ Curl Barra Z se estanca en 35 desde L6 → L9 (plateau ~3 semanas)
const WL = [
  [55,   55,   22.5, 15,   30,   14], // L1 — Sem 1
  [55,   55,   22.5, 15,   30,   14], // L2 — Sem 2
  [57.5, 55,   24,   15,   30,   14], // L3 — Sem 3
  [57.5, 57.5, 24,   17.5, 32.5, 16], // L4 — Sem 5
  [57.5, 57.5, 24,   17.5, 32.5, 16], // L5 — Sem 6
  [60,   57.5, 26,   17.5, 35,   16], // L6 — Sem 7  ← curlBarra sube a 35 y se queda
  [60,   60,   26,   20,   35,   18], // L7 — Sem 8 (1 día)
  [62.5, 60,   26,   20,   35,   18], // L8 — Sem 9
  [62.5, 62.5, 28,   20,   35,   18], // L9 — Sem 10  ← curlBarra sin avance
];

// LEGS (6 sesiones)
// Cols: [sentSmith, prensa, extCuads, pMuerto, curlIsq, hipThrust, crunchMaq]
// ⚠ Hip Thrust se estanca en 65 desde G3 → G6 (plateau ~6 semanas)
const WG = [
  [60,   100, 35,   55,   30,   60,   30  ], // G1 — Sem 1
  [62.5, 100, 35,   57.5, 30,   62.5, 30  ], // G2 — Sem 2
  [62.5, 105, 37.5, 57.5, 32.5, 65,   32.5], // G3 — Sem 3  ← hipThrust sube a 65 y se queda
  [65,   105, 37.5, 60,   32.5, 65,   35  ], // G4 — Sem 5
  [65,   110, 40,   60,   35,   65,   35  ], // G5 — Sem 7
  [67.5, 110, 40,   62.5, 35,   65,   37.5], // G6 — Sem 9  ← hipThrust sin avance
];

// ── 5. Builders ───────────────────────────────────────────────────────────────
function mkPush(fecha, i, intensidad) {
  const w = WP[i];
  const S = "Push";
  return {
    userId: USER_ID, rutinaId,
    sesionId: sId(S), sesionNombre: S, sesionColor: sColor(S),
    fecha, intensidad, creadoEn: fecha,
    ejercicios: [
      { ejercicioId: eId(S, "Press Banca"),           nombre: "Press Banca",           esExtra: false, sets: sets(4, 9,  w[0]) },
      { ejercicioId: eId(S, "Press Inclinado"),        nombre: "Press Inclinado",        esExtra: false, sets: sets(3, 10, w[1]) },
      { ejercicioId: eId(S, "Aperturas Pec Deck"),     nombre: "Aperturas Pec Deck",     esExtra: false, sets: sets(3, 12, w[2]) },
      { ejercicioId: eId(S, "Press Militar"),          nombre: "Press Militar",          esExtra: false, sets: sets(3, 10, w[3]) },
      { ejercicioId: eId(S, "Elevaciones Laterales"),  nombre: "Elevaciones Laterales",  esExtra: false, sets: sets(3, 13, w[4]) },
      { ejercicioId: eId(S, "Tríceps Polea"),          nombre: "Tríceps Polea",          esExtra: false, sets: sets(3, 12, w[5]) },
      { ejercicioId: eId(S, "Press Francés"),          nombre: "Press Francés",          esExtra: false, sets: sets(3, 10, w[6]) },
      { ejercicioId: eId(S, "Bicicleta"),              nombre: "Bicicleta",              esExtra: false, sets: [{ reps: 1, peso: 0 }] },
    ],
  };
}

function mkPull(fecha, i, intensidad) {
  const w = WL[i];
  const S = "Pull";
  return {
    userId: USER_ID, rutinaId,
    sesionId: sId(S), sesionNombre: S, sesionColor: sColor(S),
    fecha, intensidad, creadoEn: fecha,
    ejercicios: [
      { ejercicioId: eId(S, "Jalón"),           nombre: "Jalón",           esExtra: false, sets: sets(4, 10, w[0]) },
      { ejercicioId: eId(S, "Remo Polea Baja"), nombre: "Remo Polea Baja", esExtra: false, sets: sets(4, 10, w[1]) },
      { ejercicioId: eId(S, "Remo Mancuerna"),  nombre: "Remo Mancuerna",  esExtra: false, sets: sets(3, 10, w[2]) },
      { ejercicioId: eId(S, "Face Pulls"),      nombre: "Face Pulls",      esExtra: false, sets: sets(3, 15, w[3]) },
      { ejercicioId: eId(S, "Curl Barra Z"),    nombre: "Curl Barra Z",    esExtra: false, sets: sets(3, 10, w[4]) },
      { ejercicioId: eId(S, "Curl Martillo"),   nombre: "Curl Martillo",   esExtra: false, sets: sets(3, 12, w[5]) },
      { ejercicioId: eId(S, "Elíptica"),        nombre: "Elíptica",        esExtra: false, sets: [{ reps: 1, peso: 0 }] },
    ],
  };
}

function mkLegs(fecha, i, intensidad) {
  const w = WG[i];
  const S = "Legs + Core";
  return {
    userId: USER_ID, rutinaId,
    sesionId: sId(S), sesionNombre: S, sesionColor: sColor(S),
    fecha, intensidad, creadoEn: fecha,
    ejercicios: [
      { ejercicioId: eId(S, "Sentadilla Smith"),   nombre: "Sentadilla Smith",   esExtra: false, sets: sets(4, 10, w[0]) },
      { ejercicioId: eId(S, "Prensa"),             nombre: "Prensa",             esExtra: false, sets: sets(3, 12, w[1]) },
      { ejercicioId: eId(S, "Extensión Cuáds"),    nombre: "Extensión Cuáds",    esExtra: false, sets: sets(3, 13, w[2]) },
      { ejercicioId: eId(S, "Peso Muerto Rumano"), nombre: "Peso Muerto Rumano", esExtra: false, sets: sets(3, 10, w[3]) },
      { ejercicioId: eId(S, "Curl Isquios"),       nombre: "Curl Isquios",       esExtra: false, sets: sets(3, 12, w[4]) },
      { ejercicioId: eId(S, "Hip Thrust"),         nombre: "Hip Thrust",         esExtra: false, sets: sets(3, 12, w[5]) },
      { ejercicioId: eId(S, "Plancha"),            nombre: "Plancha",            esExtra: false, sets: [{ reps: 1, peso: 0 }, { reps: 1, peso: 0 }, { reps: 1, peso: 0 }] },
      { ejercicioId: eId(S, "Dead Bug"),           nombre: "Dead Bug",           esExtra: false, sets: sets(3, 8, 0) },
      { ejercicioId: eId(S, "Crunch Máquina"),     nombre: "Crunch Máquina",     esExtra: false, sets: sets(3, 15, w[6]) },
      { ejercicioId: eId(S, "Bicicleta"),          nombre: "Bicicleta",          esExtra: false, sets: [{ reps: 1, peso: 0 }] },
    ],
  };
}

// ── 6. Borrar worklogs existentes ─────────────────────────────────────────────
const borrado = db.workoutlogs.deleteMany({ userId: USER_ID });
print("🗑  Borrados: " + borrado.deletedCount + " worklogs anteriores");

// ── 7. Schedule ───────────────────────────────────────────────────────────────
//
//  Sem 01 (3d) — 05, 07, 09 Ene   Push P1, Pull L1, Legs G1
//  Sem 02 (3d) — 12, 14, 16 Ene   Push P2, Pull L2, Legs G2
//  Sem 03 (3d) — 19, 21, 23 Ene   Push P3, Pull L3, Legs G3
//  Sem 04 (1d) — 26 Ene            Push P4              (semana floja)
//  Sem 05 (3d) — 02, 04, 06 Feb   Push P5, Pull L4, Legs G4
//  Sem 06 (2d) — 09, 11 Feb        Push P6, Pull L5     (saltea vie)
//  Sem 07 (3d) — 16, 18, 20 Feb   Push P7, Pull L6, Legs G5
//  Sem 08 (1d) — 25 Feb            Pull L7              (solo mie)
//  Sem 09 (3d) — 02, 04, 06 Mar   Push P8, Pull L8, Legs G6
//  Sem 10 (2d) — 09, 11 Mar        Push P9, Pull L9     (hasta 12 mar)

const logs = [
  // Semana 1
  mkPush(d(2026, 1,  5), 0, 7),
  mkPull(d(2026, 1,  7), 0, 7),
  mkLegs(d(2026, 1,  9), 0, 8),
  // Semana 2
  mkPush(d(2026, 1, 12), 1, 8),
  mkPull(d(2026, 1, 14), 1, 7),
  mkLegs(d(2026, 1, 16), 1, 8),
  // Semana 3
  mkPush(d(2026, 1, 19), 2, 8),
  mkPull(d(2026, 1, 21), 2, 8),
  mkLegs(d(2026, 1, 23), 2, 9),
  // Semana 4 — solo lunes
  mkPush(d(2026, 1, 26), 3, 6),
  // Semana 5
  mkPush(d(2026, 2,  2), 4, 7),
  mkPull(d(2026, 2,  4), 3, 7),
  mkLegs(d(2026, 2,  6), 3, 8),
  // Semana 6 — lunes y miércoles
  mkPush(d(2026, 2,  9), 5, 8),
  mkPull(d(2026, 2, 11), 4, 7),
  // Semana 7
  mkPush(d(2026, 2, 16), 6, 9),
  mkPull(d(2026, 2, 18), 5, 8),
  mkLegs(d(2026, 2, 20), 4, 9),
  // Semana 8 — solo miércoles
  mkPull(d(2026, 2, 25), 6, 6),
  // Semana 9
  mkPush(d(2026, 3,  2), 7, 8),
  mkPull(d(2026, 3,  4), 7, 8),
  mkLegs(d(2026, 3,  6), 5, 9),
  // Semana 10 — lunes y miércoles (hasta 12 mar)
  mkPush(d(2026, 3,  9), 8, 9),
  mkPull(d(2026, 3, 11), 8, 8),
];

// ── 8. Insertar ───────────────────────────────────────────────────────────────
const res = db.workoutlogs.insertMany(logs);
const insertados = Object.keys(res.insertedIds).length;
print("✅  Insertados: " + insertados + " worklogs");
print("");
print("Resumen:");
print("  Push:      9 sesiones (P1–P9)");
print("  Pull:      9 sesiones (L1–L9)");
print("  Legs+Core: 6 sesiones (G1–G6)");
print("  Total:     24 entrenamientos");
print("  Rango:     05 Ene 2026 → 11 Mar 2026");
