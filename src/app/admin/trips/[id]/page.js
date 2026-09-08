import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ItineraryManager from "./ItineraryManager";
import PhotoUploader from "./PhotoUploader";
import CopyItineraryForm from "./CopyItineraryForm";
import TravelersManager from "./TravelersManager";

export default async function AdminTripPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  if (!trip) notFound();

  const { data: travelerRows } = await supabase
    .from("trip_travelers")
    .select("client_id, profiles(full_name)")
    .eq("trip_id", id);

  const travelers = (travelerRows || []).map((t) => ({
    id: t.client_id,
    name: t.profiles?.full_name || "(sin nombre)",
  }));

  const { data: allClients } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "client")
    .order("full_name");

  const travelerIds = new Set(travelers.map((t) => t.id));
  const availableClients = (allClients || []).filter((c) => !travelerIds.has(c.id));

  const { data: items } = await supabase
    .from("itinerary_items")
    .select("*")
    .eq("trip_id", id)
    .order("item_date")
    .order("item_time");

  const { data: photoRows } = await supabase
    .from("trip_photos")
    .select("*")
    .eq("trip_id", id)
    .order("uploaded_at", { ascending: false });

  const { data: otherTripRows } = await supabase
    .from("trips")
    .select("id, title, trip_travelers(profiles(full_name))")
    .neq("id", id)
    .order("title");

  const otherTrips = (otherTripRows || []).map((t) => ({
    id: t.id,
    title: t.title,
    clientName:
      (t.trip_travelers || [])
        .map((tt) => tt.profiles?.full_name)
        .filter(Boolean)
        .join(", ") || "(sin viajero)",
  }));

  const photos = (photoRows || []).map((p) => ({
    ...p,
    url: supabase.storage.from("trip-photos").getPublicUrl(p.storage_path)
      .data.publicUrl,
  }));

  const travelerNames = travelers.map((t) => t.name).join(", ") || "Sin viajero asignado";

  return (
    <div className="mx-auto max-w-3xl">
      <a href="/admin" className="text-sm text-brand hover:underline">
        ← Todos los viajes
      </a>
      <h1 className="mt-2 text-2xl font-semibold text-brand-dark">
        {trip.title}
      </h1>
      <p className="text-zinc-500">
        {travelerNames} · {trip.destination}
        {trip.start_date &&
          ` · ${trip.start_date} al ${trip.end_date || trip.start_date}`}
      </p>

      <section className="mt-6">
        <TravelersManager
          tripId={id}
          travelers={travelers}
          availableClients={availableClients}
        />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-800">Itinerario</h2>
        <div className="mt-3">
          <ItineraryManager tripId={id} items={items} />
          <CopyItineraryForm sourceTripId={id} otherTrips={otherTrips} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-800">Fotos</h2>
        <div className="mt-3">
          <PhotoUploader tripId={id} photos={photos} />
        </div>
      </section>
    </div>
  );
}
