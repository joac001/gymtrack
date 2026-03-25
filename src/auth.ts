import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { ObjectId } from "mongodb";
import mongoClient from "@/lib/mongodb-client";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(mongoClient),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  events: {
    async createUser({ user }) {
      // Cuando NextAuth crea un usuario nuevo, agregar campos default de GymTrack
      if (user.id) {
        const db = (await mongoClient.connect()).db();
        await db.collection("users").updateOne(
          { _id: new ObjectId(user.id) },
          { $set: { plan: "free", unidadPeso: "kg" } },
        );
      }
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) token.id = user.id;

      // Leer plan fresco de MongoDB en cada refresh del JWT
      if (token.id) {
        const db = (await mongoClient.connect()).db();
        const dbUser = await db
          .collection("users")
          .findOne(
            { _id: new ObjectId(token.id) },
            { projection: { plan: 1 } },
          );
        // Normalizar: si no es exactamente "pro", es "free"
        token.plan = dbUser?.plan === "pro" ? "pro" : "free";
      }

      if (!token.plan) token.plan = "free";

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan === "pro" ? "pro" : "free";
      }
      return session;
    },
  },
});
