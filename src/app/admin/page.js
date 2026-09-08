import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteTripButton from "./DeleteTripButton";

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

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: trips } = await supabase
    .from("trips")
    .select("*, trip_travelers(profiles(full_name))")
    .order("start_date", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Panel de administrador</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-foreground">
            Viajes
          </h1>
        </div>
        <Link
          href="/admin/trips/new"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Nuevo viaje
        </Link>
      </div>

      <div className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
        {trips?.length ? (
          trips.map((trip) => {
            const travelerNames =
              trip.trip_travelers
                ?.map((t) => t.profiles?.full_name)
                .filter(Boolean)
                .join(", ") || "Sin viajero asignado";

            return (
              <div
                key={trip.id}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50"
              >
                <Link href={`/admin/trips/${trip.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900">
                    {trip.title}
                  </p>
                  <p className="truncate text-sm text-zinc-500">
                    {travelerNames} · {trip.destination}
                  </p>
                </Link>
                <div className="flex shrink-0 items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_STYLES[trip.status] || STATUS_STYLES.upcoming
                    }`}
                  >
                    {STATUS_LABELS[trip.status] || trip.status}
                  </span>
                  <Link
                    href={`/admin/trips/${trip.id}`}
                    className="text-sm font-medium text-brand hover:underline"
                  >
                    Editar
                  </Link>
                  <DeleteTripButton tripId={trip.id} tripTitle={trip.title} />
                </div>
              </div>
            );
          })
        ) : (
          <p className="px-5 py-8 text-center text-sm text-zinc-500">
            Todavía no has creado ningún viaje.
          </p>
        )}
      </div>
    </div>
  );
}
