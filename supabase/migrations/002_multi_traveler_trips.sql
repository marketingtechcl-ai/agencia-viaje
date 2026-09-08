-- MIGRACIÓN: un viaje ahora puede tener varios viajeros a la vez
-- (antes: 1 viaje = 1 cliente, por eso al crear un viaje para 2+ personas se
-- creaba un viaje duplicado por cada una).
--
-- Corre esto UNA sola vez en el SQL Editor de tu proyecto de Supabase.
-- Es seguro: no borra ningún viaje, itinerario ni foto existente.

-- 1. Nueva tabla puente: qué clientes ven cada viaje.
create table if not exists trip_travelers (
  trip_id uuid references trips(id) on delete cascade not null,
  client_id uuid references profiles(id) on delete cascade not null,
  primary key (trip_id, client_id)
);

alter table trip_travelers enable row level security;

-- 2. Migrar los datos: cada viaje existente tenía un client_id -> pasa a ser
--    su primer (y por ahora único) viajero.
insert into trip_travelers (trip_id, client_id)
select id, client_id from trips
on conflict do nothing;

-- 3. Políticas de trip_travelers.
create policy "Cliente ve sus filas de viajero" on trip_travelers for select using (
  client_id = auth.uid()
);
create policy "Admin gestiona viajeros" on trip_travelers for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 4. Reemplazar la política de trips que dependía de client_id.
drop policy if exists "Cliente ve sus viajes" on trips;
create policy "Cliente ve sus viajes" on trips for select using (
  exists (
    select 1 from trip_travelers
    where trip_travelers.trip_id = trips.id
      and trip_travelers.client_id = auth.uid()
  )
);

-- 5. Reemplazar las políticas de itinerario y fotos que dependían de client_id.
drop policy if exists "Ver itinerario de mis viajes" on itinerary_items;
create policy "Ver itinerario de mis viajes" on itinerary_items for select using (
  exists (
    select 1 from trip_travelers
    where trip_travelers.trip_id = itinerary_items.trip_id
      and trip_travelers.client_id = auth.uid()
  )
);

drop policy if exists "Ver fotos de mis viajes" on trip_photos;
create policy "Ver fotos de mis viajes" on trip_photos for select using (
  exists (
    select 1 from trip_travelers
    where trip_travelers.trip_id = trip_photos.trip_id
      and trip_travelers.client_id = auth.uid()
  )
);

-- 6. trips.client_id ya no hace falta: ahora vive en trip_travelers.
alter table trips drop column client_id;
