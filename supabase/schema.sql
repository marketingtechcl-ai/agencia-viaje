-- ESQUEMA DE BASE DE DATOS — Portal de Agencia de Viajes
-- Ejecuta esto en el SQL Editor de tu proyecto de Supabase (una sola vez).

-- 1. Perfiles: extiende la tabla de usuarios de Supabase Auth con un rol.
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz default now()
);

-- 2. Viajes/tours: cada viaje pertenece a UN cliente y lo crea el admin.
create table trips (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  destination text,
  start_date date,
  end_date date,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'completed')),
  created_at timestamptz default now()
);

-- 3. Itinerario: puntos del itinerario de un viaje, cada uno con fecha/hora.
--    Esta misma tabla alimenta el calendario del cliente.
create table itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade not null,
  item_date date not null,
  item_time time,
  title text not null,
  description text,
  location text,
  order_index int default 0,
  created_at timestamptz default now()
);

-- 4. Fotos: fotos que el admin sube para un viaje/cliente específico.
create table trip_photos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade not null,
  storage_path text not null,
  caption text,
  uploaded_at timestamptz default now()
);

-- ---------- SEGURIDAD (Row Level Security) ----------
-- Sin esto, cualquier usuario logeado podría ver los datos de otros clientes.

alter table profiles enable row level security;
alter table trips enable row level security;
alter table itinerary_items enable row level security;
alter table trip_photos enable row level security;

-- Un usuario puede ver y editar su propio perfil.
create policy "Ver propio perfil" on profiles for select using (auth.uid() = id);
create policy "Editar propio perfil" on profiles for update using (auth.uid() = id);

-- El admin puede ver TODOS los perfiles (para asignar viajes a clientes).
create policy "Admin ve todos los perfiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Trips: el cliente solo ve SUS viajes; el admin ve y gestiona todos.
create policy "Cliente ve sus viajes" on trips for select using (client_id = auth.uid());
create policy "Admin gestiona todos los viajes" on trips for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Itinerario: visible si el usuario puede ver el viaje al que pertenece.
create policy "Ver itinerario de mis viajes" on itinerary_items for select using (
  exists (select 1 from trips where trips.id = itinerary_items.trip_id and trips.client_id = auth.uid())
);
create policy "Admin gestiona itinerario" on itinerary_items for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Fotos: mismo criterio que el itinerario.
create policy "Ver fotos de mis viajes" on trip_photos for select using (
  exists (select 1 from trips where trips.id = trip_photos.trip_id and trips.client_id = auth.uid())
);
create policy "Admin gestiona fotos" on trip_photos for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Cuando alguien se registra, crea su fila en profiles automáticamente.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'client');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- STORAGE (fotos) ----------
-- PRIMERO crea el bucket a mano en Supabase: Storage > New bucket >
-- nombre "trip-photos" > márcalo como Public. Luego corre esto:

create policy "Cualquiera logeado ve las fotos" on storage.objects
  for select using (bucket_id = 'trip-photos' and auth.role() = 'authenticated');

create policy "Admin sube fotos" on storage.objects
  for insert with check (
    bucket_id = 'trip-photos'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin borra fotos" on storage.objects
  for delete using (
    bucket_id = 'trip-photos'
    and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ---------- PRIMER ADMIN ----------
-- Después de que el dueño de la agencia cree su cuenta en /register, conviértelo
-- en admin corriendo esto UNA sola vez (cambia el correo por el suyo):
--
-- update profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'dueno@agencia.com');
