import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const STATUS_STYLES = {
  upcoming: "bg-brand/10 text-brand",
  active: "bg-accent text-brand-dark",
  completed: "bg-zinc-100 text-zinc-500",
};

const STATUS_LABELS = {
  upcoming: "Próximo",
  active: "En curso",
  completed: "Completado",
};

export default async function PortalPage() {
  const supabase = await createClient();

  // RLS ya limita esto a los viajes del cliente que tiene la sesión abierta.
  const { data: trips } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: false });

  // Si solo tiene un viaje, lo llevamos directo a su detalle.
  if (trips?.length === 1) redirect(`/portal/trips/${trips[0].id}`);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow">Mi viaje</p>
      <h1 className="mt-1 font-heading text-2xl font-bold text-foreground">
        Tus viajes
      </h1>

      <div className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
        {trips?.length ? (
          trips.map((trip) => (
            <a
              key={trip.id}
              href={`/portal/trips/${trip.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50"
            >
              <div>
                <p className="font-medium text-zinc-900">{trip.title}</p>
                <p className="text-sm text-zinc-500">{trip.destination}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  STATUS_STYLES[trip.status] || STATUS_STYLES.upcoming
                }`}
              >
                {STATUS_LABELS[trip.status] || trip.status}
              </span>
            </a>
          ))
        ) : (
          <p className="px-5 py-8 text-center text-sm text-zinc-500">
            Todavía no tienes ningún viaje asignado. Tu agencia lo verá aquí
            en cuanto lo cree.
          </p>
        )}
      </div>
    </div>
  );
}
