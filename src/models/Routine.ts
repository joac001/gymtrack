import mongoose, { Schema, Document, Model } from "mongoose";

// --- Sub-tipos ---

export interface IReps {
  desde: number;
  hasta?: number;
}

export interface IMuscContribEj {
  nombre: string;
  porcentaje: number;
}

export interface IEjercicio {
  _id: mongoose.Types.ObjectId;
  nombre: string;
  grupo?: string;
  tipoMedida: "reps" | "tiempo";
  series?: number;
  reps?: IReps;
  duracion?: string;
  notas?: string;
  orden: number;
  musculos?: IMuscContribEj[];
}

export interface ISesion {
  _id: mongoose.Types.ObjectId;
  nombre: string;
  color: string;
  dia: "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";
  orden: number;
  ejercicios: IEjercicio[];
}

// --- Documento principal ---

export interface IRoutine extends Document {
  userId: string;
  nombre: string;
  activa: boolean;
  sesiones: ISesion[];
  creadoEn: Date;
  actualizadoEn: Date;
}

// --- Schemas ---

const RepsSchema = new Schema<IReps>(
  {
    desde: { type: Number, required: true },
    hasta: { type: Number },
  },
  { _id: false }
);

const MuscContribEjSchema = new Schema<IMuscContribEj>(
  {
    nombre: { type: String, required: true },
    porcentaje: { type: Number, required: true },
  },
  { _id: false }
);

const EjercicioSchema = new Schema<IEjercicio>({
  nombre: { type: String, required: true },
  grupo: { type: String },
  tipoMedida: { type: String, enum: ["reps", "tiempo"], required: true, default: "reps" },
  series: { type: Number },
  reps: { type: RepsSchema },
  duracion: { type: String },
  notas: { type: String },
  orden: { type: Number, required: true, default: 0 },
  musculos: { type: [MuscContribEjSchema], default: undefined },
});

const SesionSchema = new Schema<ISesion>({
  nombre: { type: String, required: true },
  color: { type: String, required: true, default: "#6b6b72" },
  dia: {
    type: String,
    enum: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"],
    required: true,
  },
  orden: { type: Number, required: true, default: 0 },
  ejercicios: { type: [EjercicioSchema], default: [] },
});

const RoutineSchema = new Schema<IRoutine>(
  {
    userId: { type: String, required: true },
    nombre: { type: String, required: true },
    activa: { type: Boolean, required: true, default: false },
    sesiones: { type: [SesionSchema], default: [] },
  },
  { timestamps: { createdAt: "creadoEn", updatedAt: "actualizadoEn" } }
);

RoutineSchema.index({ userId: 1 });
RoutineSchema.index({ userId: 1, activa: 1 });

const Routine: Model<IRoutine> =
  mongoose.models.Routine || mongoose.model<IRoutine>("Routine", RoutineSchema);

export default Routine;
