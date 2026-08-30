import { notFound } from "next/navigation";
import { createClient, getProfile } from "@/lib/supabase/server";
import Calendar from "@/components/Calendar";

export default async function ClientTripPage({ params }) {
  const { id } = await params;
  const profile = await getProfile();
  const supabase = await createClient();

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .eq("client_id", profile.id)
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
      <a href="/portal" className="text-sm text-brand hover:underline">
        ← Tus viajes
      </a>
      <h1 className="mt-2 text-2xl font-semibold text-brand-dark">
        {trip.title}
      </h1>
      <p className="text-zinc-500">
        {trip.destination}
        {trip.start_date &&
          ` · ${trip.start_date} al ${trip.end_date || trip.start_date}`}
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-zinc-800">Itinerario</h2>
          <ul className="mt-3 space-y-3">
            {items?.length ? (
              items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-brand">
                    {new Date(
                      item.item_date + "T00:00:00"
                    ).toLocaleDateString("es-EC", {
                      day: "numeric",
                      month: "long",
                    })}
                    {item.item_time ? ` · ${item.item_time.slice(0, 5)}` : ""}
                  </p>
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  {item.location && (
                    <p className="text-sm text-zinc-500">{item.location}</p>
                  )}
                  {item.description && (
                    <p className="mt-1 text-sm text-zinc-600">
                      {item.description}
                    </p>
                  )}
                </li>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                Tu agencia todavía no ha cargado el itinerario.
              </p>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-800">Calendario</h2>
          <div className="mt-3">
            <Calendar items={items || []} initialMonth={trip.start_date} />
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-800">Fotos</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.url}
              alt=""
              className="aspect-square w-full rounded-lg object-cover"
            />
          ))}
        </div>
        {!photos.length && (
          <p className="text-sm text-zinc-500">
            Tu agencia todavía no ha subido fotos de este viaje.
          </p>
        )}
      </section>
    </div>
  );
}
