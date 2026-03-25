/**
 * Seed Rutina + WorkoutLogs — PPL Volumen (01 Ene 2026 → 12 Mar 2026)
 *
 * Uso en mongosh:
 *   1. Conectate a tu base:  mongosh "mongodb+srv://..."
 *   2. Seleccioná la base:   use gymtrack-dev   (o el nombre que uses)
 *   3. Ejecutá el script:    load("scripts/seed-worklogs.js")
 *
 * O pegá el contenido directamente en la consola de mongosh.
 *
 * IMPORTANTE: borra la rutina seed y TODOS los worklogs del usuario antes de insertar.
 */

// ─────────────────────────────────────────────────────────────────────────────
const USER_ID = "69c3200b2adc1db7856f7f2f"; // => userId (string del ObjectId) del usuario
// ─────────────────────────────────────────────────────────────────────────────

if (!USER_ID) {
  print("❌  Configurá USER_ID antes de ejecutar el script.");
  quit(1);
}

// ── 1. Borrar datos previos del usuario ─────────────────────────────────────
const borradoLogs = db.workoutlogs.deleteMany({ userId: USER_ID });
print("🗑  Borrados: " + borradoLogs.deletedCount + " worklogs anteriores");

// Desactivar rutinas existentes
db.routines.updateMany({ userId: USER_ID }, { $set: { activa: false } });

// ── 2. Crear rutina PPL Volumen ─────────────────────────────────────────────
const COLORES = {
  push: "#f4634a",
  pull: "#3b82f6",
  legs: "#22c55e",
};

const ahora = new Date();

const rutinaDoc = {
  userId: USER_ID,
  nombre: "PPL Volumen",
  activa: true,
  sesiones: [
    {
      _id: new ObjectId(),
      nombre: "Push",
      color: COLORES.push,
      dia: "lunes",
      orden: 0,
      ejercicios: [
        { _id: new ObjectId(), nombre: "Press Banca",          grupo: "Pecho",    tipoMedida: "reps", series: 4, reps: { desde: 8, hasta: 10 }, orden: 0 },
        { _id: new ObjectId(), nombre: "Press Inclinado",      grupo: "Pecho",    tipoMedida: "reps", series: 3, reps: { desde: 8, hasta: 10 }, orden: 1 },
        { _id: new ObjectId(), nombre: "Aperturas Pec Deck",   grupo: "Pecho",    tipoMedida: "reps", series: 3, reps: { desde: 10, hasta: 12 }, orden: 2 },
        { _id: new ObjectId(), nombre: "Press Militar",        grupo: "Hombros",  tipoMedida: "reps", series: 3, reps: { desde: 8, hasta: 10 }, orden: 3 },
        { _id: new ObjectId(), nombre: "Elevaciones Laterales", grupo: "Hombros", tipoMedida: "reps", series: 3, reps: { desde: 12, hasta: 15 }, orden: 4 },
        { _id: new ObjectId(), nombre: "Tríceps Polea",        grupo: "Tríceps",  tipoMedida: "reps", series: 3, reps: { desde: 10, hasta: 12 }, orden: 5 },
        { _id: new ObjectId(), nombre: "Press Francés",        grupo: "Tríceps",  tipoMedida: "reps", series: 3, reps: { desde: 8, hasta: 10 }, orden: 6 },
        { _id: new ObjectId(), nombre: "Bicicleta",            grupo: "Cardio",   tipoMedida: "tiempo", duracion: "10 min", orden: 7 },
      ],
    },
    {
      _id: new ObjectId(),
      nombre: "Pull",
      color: COLORES.pull,
      dia: "miercoles",
      orden: 1,
      ejercicios: [
        { _id: new ObjectId(), nombre: "Jalón",            grupo: "Espalda",  tipoMedida: "reps", series: 4, reps: { desde: 8, hasta: 10 }, orden: 0 },
        { _id: new ObjectId(), nombre: "Remo Polea Baja",  grupo: "Espalda",  tipoMedida: "reps", series: 4, reps: { desde: 8, hasta: 10 }, orden: 1 },
        { _id: new ObjectId(), nombre: "Remo Mancuerna",   grupo: "Espalda",  tipoMedida: "reps", series: 3, reps: { desde: 8, hasta: 10 }, orden: 2 },
        { _id: new ObjectId(), nombre: "Face Pulls",       grupo: "Hombros",  tipoMedida: "reps", series: 3, reps: { desde: 12, hasta: 15 }, orden: 3 },
        { _id: new ObjectId(), nombre: "Curl Barra Z",     grupo: "Bíceps",   tipoMedida: "reps", series: 3, reps: { desde: 8, hasta: 10 }, orden: 4 },
        { _id: new ObjectId(), nombre: "Curl Martillo",    grupo: "Bíceps",   tipoMedida: "reps", series: 3, reps: { desde: 10, hasta: 12 }, orden: 5 },
        { _id: new ObjectId(), nombre: "Elíptica",         grupo: "Cardio",   tipoMedida: "tiempo", duracion: "10 min", orden: 6 },
      ],
    },
    {
      _id: new ObjectId(),
      nombre: "Legs + Core",
      color: COLORES.legs,
      dia: "viernes",
      orden: 2,
      ejercicios: [
        { _id: new ObjectId(), nombre: "Sentadilla Smith",    grupo: "Cuádriceps", tipoMedida: "reps", series: 4, reps: { desde: 8, hasta: 10 }, orden: 0 },
        { _id: new ObjectId(), nombre: "Prensa",              grupo: "Cuádriceps", tipoMedida: "reps", series: 3, reps: { desde: 10, hasta: 12 }, orden: 1 },
        { _id: new ObjectId(), nombre: "Extensión Cuáds",     grupo: "Cuádriceps", tipoMedida: "reps", series: 3, reps: { desde: 12, hasta: 15 }, orden: 2 },
        { _id: new ObjectId(), nombre: "Peso Muerto Rumano",  grupo: "Isquios",    tipoMedida: "reps", series: 3, reps: { desde: 8, hasta: 10 }, orden: 3 },
        { _id: new ObjectId(), nombre: "Curl Isquios",        grupo: "Isquios",    tipoMedida: "reps", series: 3, reps: { desde: 10, hasta: 12 }, orden: 4 },
        { _id: new ObjectId(), nombre: "Hip Thrust",           grupo: "Glúteos",    tipoMedida: "reps", series: 3, reps: { desde: 10, hasta: 12 }, orden: 5 },
        { _id: new ObjectId(), nombre: "Plancha",             grupo: "Core",       tipoMedida: "tiempo", duracion: "45s", orden: 6 },
        { _id: new ObjectId(), nombre: "Dead Bug",            grupo: "Core",       tipoMedida: "reps", series: 3, reps: { desde: 8 }, orden: 7 },
        { _id: new ObjectId(), nombre: "Crunch Máquina",      grupo: "Core",       tipoMedida: "reps", series: 3, reps: { desde: 12, hasta: 15 }, orden: 8 },
        { _id: new ObjectId(), nombre: "Bicicleta",           grupo: "Cardio",     tipoMedida: "tiempo", duracion: "10 min", orden: 9 },
      ],
    },
  ],
  creadoEn: ahora,
  actualizadoEn: ahora,
};

db.routines.insertOne(rutinaDoc);
print("✔  Rutina creada: " + rutinaDoc.nombre);

// ── 3. Mapas de IDs ─────────────────────────────────────────────────────────
const rutinaId = rutinaDoc._id || db.routines.findOne({ userId: USER_ID, activa: true })._id;

const sesMap = {};
const ejMap = {};

for (const s of rutinaDoc.sesiones) {
  sesMap[s.nombre] = { id: s._id, color: s.color };
  ejMap[s.nombre] = {};
  for (const e of s.ejercicios) {
    ejMap[s.nombre][e.nombre] = e._id;
  }
}

function sId(ses)     { return sesMap[ses].id; }
function sColor(ses)  { return sesMap[ses].color; }
function eId(ses, ej) { return ejMap[ses][ej]; }

// ── 4. Helpers ──────────────────────────────────────────────────────────────
function sets(n, reps, peso) {
  return Array.from({ length: n }, () => ({ reps: reps, peso: peso }));
}
function d(y, m, day) {
  return new Date(Date.UTC(y, m - 1, day, 10, 0, 0));
}

// ── 5. Tablas de pesos progresivos ──────────────────────────────────────────
//
// PUSH (9 sesiones)
// Cols: [pressBanca, pressIncl, aperturas, presMilitar, elevLat, tricepsPolea, pressFrances]
const WP = [
  [60,   50,   40,   42.5, 10, 22.5, 30  ],
  [60,   50,   40,   42.5, 10, 22.5, 30  ],
  [60,   50,   42.5, 42.5, 10, 22.5, 30  ],
  [62.5, 52.5, 42.5, 45,   10, 25,   32.5],
  [62.5, 52.5, 42.5, 45,   12, 25,   32.5],
  [62.5, 52.5, 45,   45,   12, 25,   32.5],
  [65,   55,   45,   47.5, 12, 27.5, 35  ],
  [65,   55,   45,   47.5, 12, 27.5, 35  ],
  [67.5, 57.5, 47.5, 47.5, 14, 27.5, 35  ],
];

// PULL (9 sesiones)
// Cols: [jalon, remoPolea, remoManc, facePulls, curlBarra, curlMart]
// Curl Barra Z se estanca en 35 desde L6 → L9
const WL = [
  [55,   55,   22.5, 15,   30,   14],
  [55,   55,   22.5, 15,   30,   14],
  [57.5, 55,   24,   15,   30,   14],
  [57.5, 57.5, 24,   17.5, 32.5, 16],
  [57.5, 57.5, 24,   17.5, 32.5, 16],
  [60,   57.5, 26,   17.5, 35,   16],
  [60,   60,   26,   20,   35,   18],
  [62.5, 60,   26,   20,   35,   18],
  [62.5, 62.5, 28,   20,   35,   18],
];

// LEGS (6 sesiones)
// Cols: [sentSmith, prensa, extCuads, pMuerto, curlIsq, hipThrust, crunchMaq]
// Hip Thrust se estanca en 65 desde G3 → G6
const WG = [
  [60,   100, 35,   55,   30,   60,   30  ],
  [62.5, 100, 35,   57.5, 30,   62.5, 30  ],
  [62.5, 105, 37.5, 57.5, 32.5, 65,   32.5],
  [65,   105, 37.5, 60,   32.5, 65,   35  ],
  [65,   110, 40,   60,   35,   65,   35  ],
  [67.5, 110, 40,   62.5, 35,   65,   37.5],
];

// ── 6. Builders ─────────────────────────────────────────────────────────────
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

// ── 7. Schedule ─────────────────────────────────────────────────────────────
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

// ── 8. Insertar ─────────────────────────────────────────────────────────────
const res = db.workoutlogs.insertMany(logs);
const insertados = Object.keys(res.insertedIds).length;
print("✅  Insertados: " + insertados + " worklogs");
print("");
print("Resumen:");
print("  Rutina:    PPL Volumen (activa)");
print("  Push:      9 sesiones (P1–P9)");
print("  Pull:      9 sesiones (L1–L9)");
print("  Legs+Core: 6 sesiones (G1–G6)");
print("  Total:     24 entrenamientos");
print("  Rango:     05 Ene 2026 → 11 Mar 2026");
