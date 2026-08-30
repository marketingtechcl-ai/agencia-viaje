"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";

// Calendario mensual simple: marca con un punto los días que tienen
// puntos de itinerario, y resalta el día seleccionado.
export default function Calendar({ items = [], initialMonth }) {
  const datesWithItems = new Set(items.map((i) => i.item_date));
  const [month, setMonth] = useState(
    initialMonth ? parseISO(initialMonth) : new Date()
  );
  const [selected, setSelected] = useState(null);

  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });

  const days = [];
  let day = start;
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  const itemsForSelected = selected
    ? items.filter((i) => i.item_date === selected)
    : [];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMonth(subMonths(month, 1))}
          className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100"
        >
          ←
        </button>
        <p className="font-medium capitalize text-zinc-800">
          {format(month, "MMMM yyyy", { locale: es })}
        </p>
        <button
          onClick={() => setMonth(addMonths(month, 1))}
          className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100"
        >
          →
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-400">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((d) => {
          const iso = format(d, "yyyy-MM-dd");
          const hasItem = datesWithItems.has(iso);
          const isSelected = selected === iso;
          const inMonth = isSameMonth(d, month);

          return (
            <button
              key={iso}
              onClick={() => setSelected(hasItem ? iso : null)}
              className={[
                "flex h-10 flex-col items-center justify-center rounded-lg text-sm",
                inMonth ? "text-zinc-800" : "text-zinc-300",
                isSelected ? "bg-brand text-white" : hasItem ? "bg-brand/10" : "",
                hasItem && !isSelected ? "font-semibold text-brand-dark" : "",
              ].join(" ")}
            >
              {format(d, "d")}
              {hasItem && (
                <span
                  className={`mt-0.5 h-1 w-1 rounded-full ${
                    isSelected ? "bg-white" : "bg-brand"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 border-t border-zinc-100 pt-3">
          <p className="text-sm font-medium text-zinc-700">
            {format(parseISO(selected), "d 'de' MMMM", { locale: es })}
          </p>
          <ul className="mt-2 space-y-1">
            {itemsForSelected.map((i) => (
              <li key={i.id} className="text-sm text-zinc-600">
                {i.item_time ? `${i.item_time.slice(0, 5)} · ` : ""}
                {i.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
