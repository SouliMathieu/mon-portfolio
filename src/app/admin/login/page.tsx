"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1B2838] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl"
      >
        <h1 className="font-[var(--font-space-grotesk)] text-2xl text-[#F4F6F8] mb-1">
          Connexion Admin
        </h1>
        <p className="font-[var(--font-ibm-plex-mono)] text-xs text-[#4DFFA0] mb-6">
          Accès réservé
        </p>

        <label className="block mb-4">
          <span className="text-sm text-[#F4F6F8]/80">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-[#F4F6F8] outline-none focus:border-[#4DFFA0] transition-colors"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm text-[#F4F6F8]/80">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-[#F4F6F8] outline-none focus:border-[#4DFFA0] transition-colors"
          />
        </label>

        {error && (
          <p className="mb-4 text-sm text-red-400 font-[var(--font-ibm-plex-mono)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#4DFFA0] text-[#1B2838] font-semibold py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}