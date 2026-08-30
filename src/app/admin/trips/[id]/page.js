import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ItineraryManager from "./ItineraryManager";
import PhotoUploader from "./PhotoUploader";

export default async function AdminTripPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trip } = await supabase
    .from("trips")
    .select("*, profiles:client_id(full_name)")
    .eq("id", id)
    .single();

  if (!trip) notFound();

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

  const photos = (photoRows || []).map((p) => ({
    ...p,
    url: supabase.storage.from("trip-photos").getPublicUrl(p.storage_path)
      .data.publicUrl,
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <a href="/admin" className="text-sm text-brand hover:underline">
        ← Todos los viajes
      </a>
      <h1 className="mt-2 text-2xl font-semibold text-brand-dark">
        {trip.title}
      </h1>
      <p className="text-zinc-500">
        {trip.profiles?.full_name} · {trip.destination}
        {trip.start_date &&
          ` · ${trip.start_date} al ${trip.end_date || trip.start_date}`}
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-800">Itinerario</h2>
        <div className="mt-3">
          <ItineraryManager tripId={id} items={items} />
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
