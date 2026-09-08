"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTrip(formData) {
  const supabase = await createClient();

  const clientIds = formData.getAll("client_ids").filter(Boolean);
  if (!clientIds.length) {
    throw new Error("Selecciona al menos un viajero.");
  }

  const base = {
    title: formData.get("title"),
    destination: formData.get("destination"),
    start_date: formData.get("start_date") || null,
    end_date: formData.get("end_date") || null,
  };

  // Un solo viaje, sin importar cuántos viajeros lo comparten.
  const { data: trip, error } = await supabase
    .from("trips")
    .insert(base)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { error: travelersError } = await supabase.from("trip_travelers").insert(
    clientIds.map((client_id) => ({ trip_id: trip.id, client_id }))
  );

  if (travelersError) {
    throw new Error(travelersError.message);
  }

  redirect(`/admin/trips/${trip.id}`);
}
