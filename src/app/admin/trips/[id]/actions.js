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
