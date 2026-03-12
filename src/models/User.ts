import mongoose, { Schema } from "mongoose";

// El modelo User comparte la colección "users" con el adapter de NextAuth.
// Solo definimos los campos propios de GymTrack; el resto (name, email, image, etc.)
// lo gestiona NextAuth. strict: false evita que Mongoose stripe esos campos.
const UserSchema = new Schema(
  {
    unidadPeso: {
      type: String,
      enum: ["kg", "lbs"],
      default: "kg",
    },
  },
  { strict: false, collection: "users" },
);

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
export default User;
