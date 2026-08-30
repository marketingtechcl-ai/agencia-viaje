"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "trip-photos";

export default function PhotoUploader({ tripId, photos }) {
  const router = useRouter();
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError("");

    for (const file of files) {
      // eslint-disable-next-line react-hooks/purity -- nombre de archivo único, corre solo dentro del handler de subida (no en render)
      const path = `${tripId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file);

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      await supabase.from("trip_photos").insert({
        trip_id: tripId,
        storage_path: path,
      });
    }

    setUploading(false);
    e.target.value = "";
    router.refresh();
  }

  async function handleDelete(photo) {
    await supabase.storage.from(BUCKET).remove([photo.storage_path]);
    await supabase.from("trip_photos").delete().eq("id", photo.id);
    router.refresh();
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
        {uploading ? "Subiendo…" : "+ Subir fotos"}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos?.map((photo) => (
          <div key={photo.id} className="group relative">
            <img
              src={photo.url}
              alt=""
              className="aspect-square w-full rounded-lg object-cover"
            />
            <button
              onClick={() => handleDelete(photo)}
              className="absolute right-1.5 top-1.5 hidden rounded-full bg-black/60 px-2 py-0.5 text-xs text-white group-hover:block"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      {!photos?.length && (
        <p className="mt-3 text-sm text-zinc-500">
          Todavía no has subido fotos de este viaje.
        </p>
      )}
    </div>
  );
}
