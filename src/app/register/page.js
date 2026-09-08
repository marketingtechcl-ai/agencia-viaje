"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Todo usuario nuevo entra como "client" (ver trigger handle_new_user en la
    // base de datos). El admin se promueve manualmente una sola vez desde Supabase.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <h1 className="font-heading text-xl font-bold text-foreground">
              ¡Cuenta creada!
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Ya puedes iniciar sesión. Si tu agencia configuró confirmación por
              correo, revisa tu bandeja de entrada antes de entrar.
            </p>
            <a
              href="/login"
              className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 font-medium text-white hover:bg-brand-dark"
            >
              Ir a iniciar sesión
            </a>
          </div>
        </div>
      </div>
    );
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
          <p className="eyebrow">Antes de viajar</p>
          <h1 className="mt-2 font-heading text-xl font-bold text-foreground">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Para ver el itinerario y las fotos de tu viaje.
          </p>

          <label className="mt-6 block text-sm font-medium text-zinc-700">
            Nombre completo
          </label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-brand"
          />

          <label className="mt-4 block text-sm font-medium text-zinc-700">
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
            minLength={6}
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
            {loading ? "Creando…" : "Crear cuenta"}
          </button>

          <p className="mt-4 text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="font-medium text-brand hover:underline">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
