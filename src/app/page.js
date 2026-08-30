import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/server";

export default async function Home() {
  const profile = await getProfile();

  if (profile?.role === "admin") redirect("/admin");
  if (profile) redirect("/portal");

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-brand-dark">
          Portal de Viajes
        </h1>
        <p className="mt-3 text-zinc-600">
          Consulta tu itinerario, tus fotos y el calendario de tu viaje.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/login"
            className="rounded-lg bg-brand px-5 py-2.5 font-medium text-white hover:bg-brand-dark"
          >
            Iniciar sesión
          </a>
          <a
            href="/register"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Crear cuenta
          </a>
        </div>
      </div>
    </div>
  );
}
