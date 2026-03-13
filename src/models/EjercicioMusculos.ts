import mongoose, { Schema, Model } from "mongoose";

export interface IMuscContrib {
  nombre: string;
  porcentaje: number;
}

export interface IEjercicioMusculos {
  nombreNorm: string;
  musculos: IMuscContrib[];
  creadoEn: Date;
}

const MuscContribSchema = new Schema<IMuscContrib>(
  {
    nombre: { type: String, required: true },
    porcentaje: { type: Number, required: true },
  },
  { _id: false }
);

const EjercicioMusculosSchema = new Schema<IEjercicioMusculos>({
  nombreNorm: { type: String, required: true, unique: true },
  musculos: { type: [MuscContribSchema], required: true },
  creadoEn: { type: Date, default: Date.now },
});

const EjercicioMusculos: Model<IEjercicioMusculos> =
  mongoose.models.EjercicioMusculos ||
  mongoose.model<IEjercicioMusculos>("EjercicioMusculos", EjercicioMusculosSchema);

export default EjercicioMusculos;
