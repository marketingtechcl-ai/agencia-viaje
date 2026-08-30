"use client";

import { useRef, useTransition } from "react";
import { addItineraryItem, deleteItineraryItem } from "./actions";

export default function ItineraryManager({ tripId, items }) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    startTransition(async () => {
      await addItineraryItem(tripId, formData);
      formRef.current?.reset();
    });
  }

  return (
    <div>
      <ul className="space-y-3">
        {items?.length ? (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between rounded-lg border border-zinc-200 bg-white p-4"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-brand">
                  {new Date(item.item_date + "T00:00:00").toLocaleDateString(
                    "es-EC",
                    { day: "numeric", month: "long" }
                  )}
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
              </div>
              <form action={() => deleteItineraryItem(tripId, item.id)}>
                <button className="text-sm text-red-500 hover:underline">
                  Eliminar
                </button>
              </form>
            </li>
          ))
        ) : (
          <p className="text-sm text-zinc-500">
            Todavía no hay puntos en el itinerario.
          </p>
        )}
      </ul>

      <form
        ref={formRef}
        action={handleSubmit}
        className="mt-6 space-y-3 rounded-lg border border-dashed border-zinc-300 p-4"
      >
        <p className="text-sm font-medium text-zinc-700">
          Agregar punto al itinerario
        </p>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="item_date"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            type="time"
            name="item_time"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <input
          name="title"
          required
          placeholder="Ej. Traslado al hotel"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          name="location"
          placeholder="Ubicación (opcional)"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <textarea
          name="description"
          placeholder="Detalles (opcional)"
          rows={2}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {isPending ? "Agregando…" : "Agregar"}
        </button>
      </form>
    </div>
  );
}
