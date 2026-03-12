import mongoose, { Schema, Document, Model } from "mongoose";

// --- Sub-tipos ---

export interface ISet {
  reps: number;
  peso: number;
}

export interface IEjercicioLog {
  ejercicioId?: mongoose.Types.ObjectId;
  nombre: string;
  esExtra: boolean;
  sets: ISet[];
}

// --- Documento principal ---

export interface IWorkoutLog extends Document {
  userId: string;
  rutinaId: mongoose.Types.ObjectId;
  sesionId: mongoose.Types.ObjectId;
  sesionNombre: string;
  sesionColor: string;
  fecha: Date;
  ejercicios: IEjercicioLog[];
  intensidad: number;
  notasPre?: string;
  notas?: string;
  creadoEn: Date;
}

// --- Schemas ---

const SetSchema = new Schema<ISet>(
  {
    reps: { type: Number, required: true },
    peso: { type: Number, required: true },
  },
  { _id: false }
);

const EjercicioLogSchema = new Schema<IEjercicioLog>(
  {
    ejercicioId: { type: Schema.Types.ObjectId },
    nombre: { type: String, required: true },
    esExtra: { type: Boolean, required: true, default: false },
    sets: { type: [SetSchema], required: true },
  },
  { _id: false }
);

const WorkoutLogSchema = new Schema<IWorkoutLog>(
  {
    userId: { type: String, required: true },
    rutinaId: { type: Schema.Types.ObjectId, required: true },
    sesionId: { type: Schema.Types.ObjectId, required: true },
    sesionNombre: { type: String, required: true },
    sesionColor: { type: String, required: true },
    fecha: { type: Date, required: true },
    ejercicios: { type: [EjercicioLogSchema], default: [] },
    intensidad: { type: Number, required: true, min: 1, max: 10 },
    notasPre: { type: String },
    notas: { type: String },
  },
  { timestamps: { createdAt: "creadoEn", updatedAt: false } }
);

WorkoutLogSchema.index({ userId: 1, fecha: -1 });
WorkoutLogSchema.index({ userId: 1, rutinaId: 1, fecha: -1 });
WorkoutLogSchema.index({ userId: 1, "ejercicios.ejercicioId": 1, fecha: -1 });

const WorkoutLog: Model<IWorkoutLog> =
  mongoose.models.WorkoutLog ||
  mongoose.model<IWorkoutLog>("WorkoutLog", WorkoutLogSchema);

export default WorkoutLog;
