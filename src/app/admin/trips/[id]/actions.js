"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addItineraryItem(tripId, formData) {
  const supabase = await createClient();

  const { error } = await supabase.from("itinerary_items").insert({
    trip_id: tripId,
    item_date: formData.get("item_date"),
    item_time: formData.get("item_time") || null,
    title: formData.get("title"),
    description: formData.get("description") || null,
    location: formData.get("location") || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/trips/${tripId}`);
  revalidatePath(`/portal/trips/${tripId}`);
}

export async function updateItineraryItem(tripId, itemId, formData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("itinerary_items")
    .update({
      item_date: formData.get("item_date"),
      item_time: formData.get("item_time") || null,
      title: formData.get("title"),
      description: formData.get("description") || null,
      location: formData.get("location") || null,
    })
    .eq("id", itemId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/trips/${tripId}`);
  revalidatePath(`/portal/trips/${tripId}`);
}

export async function deleteItineraryItem(tripId, itemId) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("itinerary_items")
    .delete()
    .eq("id", itemId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/trips/${tripId}`);
  revalidatePath(`/portal/trips/${tripId}`);
}


export async function copyItineraryToTrips(sourceTripId, targetTripIds) {
  const supabase = await createClient();

  if (!targetTripIds?.length) {
    throw new Error("Selecciona al menos un viaje destino.");
  }

  const { data: items, error: fetchError } = await supabase
    .from("itinerary_items")
    .select("item_date, item_time, title, description, location, order_index")
    .eq("trip_id", sourceTripId);

  if (fetchError) throw new Error(fetchError.message);
  if (!items?.length) {
    throw new Error("Este viaje todavía no tiene puntos de itinerario para copiar.");
  }

  const rows = targetTripIds.flatMap((tripId) =>
    items.map((item) => ({ ...item, trip_id: tripId }))
  );

  const { error } = await supabase.from("itinerary_items").insert(rows);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/trips/${sourceTripId}`);
  targetTripIds.forEach((tripId) => {
    revalidatePath(`/admin/trips/${tripId}`);
    revalidatePath(`/portal/trips/${tripId}`);
  });
}
