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
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) token.id = user.id;

      // Cargar plan desde MongoDB al hacer login o cuando se refresca la sesión
      if (token.id && (user || trigger === "update")) {
        const db = (await mongoClient.connect()).db();
        const dbUser = await db
          .collection("users")
          .findOne(
            { _id: new ObjectId(token.id) },
            { projection: { plan: 1 } },
          );
        token.plan = (dbUser?.plan as "free" | "pro") ?? "free";
      }

      // Si no se cargó aún, default a free
      if (!token.plan) token.plan = "free";

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as "free" | "pro") ?? "free";
      }
      return session;
    },
  },
});
