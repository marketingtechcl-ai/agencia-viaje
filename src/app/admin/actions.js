"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateTrip(tripId, formData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("trips")
    .update({
      title: formData.get("title"),
      destination: formData.get("destination"),
      start_date: formData.get("start_date") || null,
      end_date: formData.get("end_date") || null,
      status: formData.get("status"),
    })
    .eq("id", tripId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/trips/${tripId}`);
  revalidatePath("/admin");
  revalidatePath(`/portal/trips/${tripId}`);
  revalidatePath("/portal");
}

export async function deleteTrip(tripId) {
  const supabase = await createClient();

  // Las filas de itinerario, fotos y viajeros se borran solas (ON DELETE
  // CASCADE), pero los archivos de fotos en Storage no, así que los
  // borramos primero a mano.
  const { data: photoRows } = await supabase
    .from("trip_photos")
    .select("storage_path")
    .eq("trip_id", tripId);

  if (photoRows?.length) {
    await supabase.storage
      .from("trip-photos")
      .remove(photoRows.map((p) => p.storage_path));
  }

  const { error } = await supabase.from("trips").delete().eq("id", tripId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/portal");
}
