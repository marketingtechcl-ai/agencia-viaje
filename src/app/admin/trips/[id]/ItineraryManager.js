"use client";

import { useRef, useState, useTransition } from "react";
import {
  addItineraryItem,
  deleteItineraryItem,
  updateItineraryItem,
} from "./actions";

function EditItemForm({ tripId, item, onDone }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    startTransition(async () => {
      await updateItineraryItem(tripId, item.id, formData);
      onDone();
    });
  }

  return (
    <form
      action={handleSubmit}
      className="w-full space-y-3 rounded-2xl border border-brand/40 bg-brand/5 p-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          name="item_date"
          required
          defaultValue={item.item_date}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          type="time"
          name="item_time"
          defaultValue={item.item_time ? item.item_time.slice(0, 5) : ""}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <input
        name="title"
        required
        defaultValue={item.title}
        placeholder="Ej. Traslado al hotel"
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />
      <input
        name="location"
        defaultValue={item.location || ""}
        placeholder="Ubicación (opcional)"
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />
      <textarea
        name="description"
        defaultValue={item.description || ""}
        placeholder="Detalles (opcional)"
        rows={2}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />
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
          onClick={onDone}
          disabled={isPending}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function ItineraryManager({ tripId, items }) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState(null);

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
          items.map((item) =>
            editingId === item.id ? (
              <li key={item.id} className="flex">
                <EditItemForm
                  tripId={tripId}
                  item={item}
                  onDone={() => setEditingId(null)}
                />
              </li>
            ) : (
              <li
                key={item.id}
                className="flex items-start justify-between rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <div>
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
                </div>
                <div className="flex shrink-0 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingId(item.id)}
                    className="text-sm text-brand hover:underline"
                  >
                    Editar
                  </button>
                  <form
                    action={() => deleteItineraryItem(tripId, item.id)}
                    onSubmit={(e) => {
                      if (
                        !confirm(
                          "\u00bfEliminar este punto del itinerario? Esta acci\u00f3n no se puede deshacer."
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <button className="text-sm text-red-500 hover:underline">
                      Eliminar
                    </button>
                  </form>
                </div>
              </li>
            )
          )
        ) : (
          <p className="text-sm text-zinc-500">
            Todavía no hay puntos en el itinerario.
          </p>
        )}
      </ul>

      <form
        ref={formRef}
        action={handleSubmit}
        className="mt-6 space-y-3 rounded-2xl border border-dashed border-zinc-300 p-4"
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
          className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {isPending ? "Agregando…" : "Agregar"}
        </button>
      </form>
    </div>
  );
}
