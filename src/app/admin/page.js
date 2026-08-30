import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: trips } = await supabase
    .from("trips")
    .select("*, profiles:client_id(full_name)")
    .order("start_date", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-dark">Viajes</h1>
        <Link
          href="/admin/trips/new"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Nuevo viaje
        </Link>
      </div>

      <div className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {trips?.length ? (
          trips.map((trip) => (
            <a
              key={trip.id}
              href={`/admin/trips/${trip.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50"
            >
              <div>
                <p className="font-medium text-zinc-900">{trip.title}</p>
                <p className="text-sm text-zinc-500">
                  {trip.profiles?.full_name || "Cliente sin nombre"} ·{" "}
                  {trip.destination}
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-600">
                {trip.status}
              </span>
            </a>
          ))
        ) : (
          <p className="px-5 py-8 text-center text-sm text-zinc-500">
            Todavía no has creado ningún viaje.
          </p>
        )}
      </div>
    </div>
  );
}
