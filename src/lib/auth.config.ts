import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  // Nécessaire pour que Auth.js accepte l'hôte (localhost en local, ton
  // nom de domaine une fois déployé). Sans ça : erreur "UntrustedHost"
  // en mode production (`next start` / déploiement réel).
  trustHost: true,
  providers: [], // Les providers (Credentials) sont ajoutés dans src/lib/auth.ts
} satisfies NextAuthConfig;