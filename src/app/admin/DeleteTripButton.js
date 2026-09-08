"use client";

import { useTransition } from "react";
import { deleteTrip } from "./actions";

export default function DeleteTripButton({ tripId, tripTitle }) {
  const [isPending, startTransition] = useTransition();

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (
      !confirm(
        `¿Eliminar "${tripTitle}" por completo? Se borrará su itinerario, sus fotos y el acceso de todos sus viajeros. Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }
    startTransition(() => deleteTrip(tripId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-sm font-medium text-red-500 hover:underline disabled:opacity-60"
    >
      {isPending ? "…" : "Eliminar"}
    </button>
  );
}
