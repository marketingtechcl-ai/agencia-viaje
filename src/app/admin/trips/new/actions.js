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

  const { data: trips, error } = await supabase
    .from("trips")
    .insert(clientIds.map((client_id) => ({ ...base, client_id })))
    .select();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/admin/trips/${trips[0].id}`);
}
