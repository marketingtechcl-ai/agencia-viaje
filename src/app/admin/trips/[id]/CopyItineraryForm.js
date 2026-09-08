"use client";

import { useState, useTransition } from "react";
import { copyItineraryToTrips } from "./actions";

export default function CopyItineraryForm({ sourceTripId, otherTrips }) {
  const [selected, setSelected] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);

  function toggle(tripId) {
    setSelected((prev) =>
      prev.includes(tripId)
        ? prev.filter((id) => id !== tripId)
        : [...prev, tripId]
    );
  }

  function handleCopy() {
    setMessage(null);
    startTransition(async () => {
      try {
        await copyItineraryToTrips(sourceTripId, selected);
        setMessage({
          type: "ok",
          text: "Itinerario copiado. Ya pueden verlo en sus viajes.",
        });
        setSelected([]);
      } catch (err) {
        setMessage({ type: "error", text: err.message });
      }
    });
  }

  if (!otherTrips?.length) return null;

  return (
    <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-4">
      <p className="text-sm font-medium text-zinc-700">
        Copiar este itinerario a otros viajes
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Para agregar viajeros a ESTE mismo viaje usa &quot;Viajeros de este
        viaje&quot; arriba (verán este mismo itinerario automáticamente). Usa
        esto solo para reutilizar el itinerario en un viaje distinto (otro
        grupo, otra fecha).
      </p>
      <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
        {otherTrips.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-2 text-sm text-zinc-700"
          >
            <input
              type="checkbox"
              checked={selected.includes(t.id)}
              onChange={() => toggle(t.id)}
              className="rounded border-zinc-300"
            />
            {t.title} — {t.clientName}
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        disabled={isPending || !selected.length}
        className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {isPending ? "Copiando…" : "Copiar itinerario a los seleccionados"}
      </button>
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.type === "ok" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
