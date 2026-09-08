"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
        >
          <p className="eyebrow">Bienvenido de nuevo</p>
          <h1 className="mt-2 font-heading text-xl font-bold text-foreground">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Entra para ver tu viaje.
          </p>

          <label className="mt-6 block text-sm font-medium text-zinc-700">
            Correo
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand"
          />

          <label className="mt-4 block text-sm font-medium text-zinc-700">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand"
          />

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-brand py-2.5 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>

          <p className="mt-4 text-center text-sm text-zinc-500">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="font-medium text-brand hover:underline">
              Regístrate
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
