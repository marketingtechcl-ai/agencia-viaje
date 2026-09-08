"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full rounded-lg bg-brand py-2.5 font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Creando..." : "Crear viaje"}
    </button>
  );
}
