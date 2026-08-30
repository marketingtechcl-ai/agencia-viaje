"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTrip(formData) {
  const supabase = await createClient();

  const { data: trip, error } = await supabase
    .from("trips")
    .insert({
      client_id: formData.get("client_id"),
      title: formData.get("title"),
      destination: formData.get("destination"),
      start_date: formData.get("start_date") || null,
      end_date: formData.get("end_date") || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/admin/trips/${trip.id}`);
}
