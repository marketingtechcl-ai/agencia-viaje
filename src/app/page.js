import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/server";
import Logo from "@/components/Logo";

export default async function Home() {
  const profile = await getProfile();

  if (profile?.role === "admin") redirect("/admin");
  if (profile) redirect("/portal");

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="eyebrow mt-8 justify-center">De tu viaje al detalle</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-foreground">
          Tu itinerario, en un solo lugar.
        </h1>
        <p className="mt-3 text-zinc-600">
          Consulta tu itinerario, tus fotos y el calendario de tu viaje.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/login"
            className="rounded-full bg-brand px-6 py-2.5 font-medium text-white hover:bg-brand-dark"
          >
            Iniciar sesión
          </a>
          <a
            href="/register"
            className="rounded-full border border-zinc-300 px-6 py-2.5 font-medium text-zinc-700 hover:border-brand hover:text-brand"
          >
            Crear cuenta
          </a>
        </div>
      </div>
    </div>
  );
}
