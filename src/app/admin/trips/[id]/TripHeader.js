"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTrip, deleteTrip } from "@/app/admin/actions";

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Próximo" },
  { value: "active", label: "En curso" },
  { value: "completed", label: "Completado" },
];

export default function TripHeader({ trip, travelerNames }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function handleSave(formData) {
    setError(null);
    startTransition(async () => {
      try {
        await updateTrip(trip.id, formData);
        setIsEditing(false);
      } catch (err) {
        setError(err.message);
      }
    });
  }

  function handleDelete() {
    if (
      !confirm(
        `¿Eliminar "${trip.title}" por completo? Se borrará su itinerario, sus fotos y el acceso de todos sus viajeros. Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await deleteTrip(trip.id);
        router.push("/admin");
      } catch (err) {
        setError(err.message);
      }
    });
  }

  if (isEditing) {
    return (
      <form
        action={handleSave}
        className="mt-4 space-y-3 rounded-2xl border border-brand/40 bg-brand/5 p-4"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Nombre del viaje
          </label>
          <input
            name="title"
            required
            defaultValue={trip.title}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Destino
          </label>
          <input
            name="destination"
            defaultValue={trip.destination || ""}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Fecha de inicio
            </label>
            <input
              type="date"
              name="start_date"
              defaultValue={trip.start_date || ""}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Fecha de fin
            </label>
            <input
              type="date"
              name="end_date"
              defaultValue={trip.end_date || ""}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Estado
          </label>
          <select
            name="status"
            defaultValue={trip.status}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {isPending ? "Guardando…" : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={isPending}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {trip.title}
          </h1>
          <p className="text-zinc-500">
            {travelerNames} · {trip.destination}
            {trip.start_date &&
              ` · ${trip.start_date} al ${trip.end_date || trip.start_date}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-brand hover:underline"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="text-sm font-medium text-red-500 hover:underline disabled:opacity-60"
          >
            {isPending ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
