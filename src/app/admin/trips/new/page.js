import { createClient } from "@/lib/supabase/server";
import { createTrip } from "./actions";

export default async function NewTripPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "client")
    .order("full_name");

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-brand-dark">Nuevo viaje</h1>

      <form
        action={createTrip}
        className="mt-6 space-y-4 rounded-xl border border-zinc-200 bg-white p-6"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Cliente
          </label>
          <select
            name="client_id"
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
          >
            <option value="">Selecciona un cliente…</option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name || "(sin nombre)"}
              </option>
            ))}
          </select>
          {!clients?.length && (
            <p className="mt-1 text-xs text-amber-600">
              Todavía no hay clientes registrados. Pide a tu cliente que cree su
              cuenta en /register, y luego aparecerá aquí.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Nombre del viaje
          </label>
          <input
            name="title"
            required
            placeholder="Ej. Luna de miel en Galápagos"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Destino
          </label>
          <input
            name="destination"
            placeholder="Ej. Islas Galápagos, Ecuador"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Fecha de inicio
            </label>
            <input
              type="date"
              name="start_date"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Fecha de fin
            </label>
            <input
              type="date"
              name="end_date"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-brand py-2.5 font-medium text-white hover:bg-brand-dark"
        >
          Crear viaje
        </button>
      </form>
    </div>
  );
}
