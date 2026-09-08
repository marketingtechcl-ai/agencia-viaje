import Link from "next/link";
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
              <a
                key={trip.id}
                href={`/admin/trips/${trip.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50"
              >
                <div>
                  <p className="font-medium text-zinc-900">{trip.title}</p>
                  <p className="text-sm text-zinc-500">
                    {travelerNames} · {trip.destination}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    STATUS_STYLES[trip.status] || STATUS_STYLES.upcoming
                  }`}
                >
                  {STATUS_LABELS[trip.status] || trip.status}
                </span>
              </a>
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
