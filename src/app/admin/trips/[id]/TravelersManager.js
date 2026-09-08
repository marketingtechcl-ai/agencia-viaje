"use client";

import { useState, useTransition } from "react";
import { addTraveler, removeTraveler } from "./actions";

export default function TravelersManager({ tripId, travelers, availableClients }) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState("");
  const [error, setError] = useState(null);

  function handleAdd() {
    setError(null);
    if (!selected) return;
    startTransition(async () => {
      try {
        await addTraveler(tripId, selected);
        setSelected("");
      } catch (err) {
        setError(err.message);
      }
    });
  }

  function handleRemove(clientId) {
    if (
      !confirm(
        "¿Quitar a este viajero del viaje? Ya no podrá ver este itinerario ni estas fotos."
      )
    ) {
      return;
    }
    setError(null);
    startTransition(() => removeTraveler(tripId, clientId));
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <p className="text-sm font-medium text-zinc-700">Viajeros de este viaje</p>

      <ul className="mt-2 space-y-1">
        {travelers?.length ? (
          travelers.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between text-sm text-zinc-700"
            >
              <span>{t.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(t.id)}
                disabled={isPending}
                className="text-xs text-red-500 hover:underline disabled:opacity-60"
              >
                Quitar
              </button>
            </li>
          ))
        ) : (
          <li className="text-sm text-zinc-500">
            Este viaje todavía no tiene ningún viajero asignado.
          </li>
        )}
      </ul>

      {availableClients?.length > 0 && (
        <div className="mt-3 flex gap-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">Agregar viajero…</option>
            {availableClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name || "(sin nombre)"}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isPending || !selected}
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {isPending ? "…" : "Agregar"}
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
