# Portal de Viajes

Sitio web para tu cliente (agencia de viajes): un panel de administrador donde sube fotos y arma el itinerario de cada viaje, y un portal donde cada cliente final se logea y ve **su** itinerario, **sus** fotos y **su** calendario del tour.

Construido con **Next.js** + **Supabase** (base de datos, login y almacenamiento de fotos) + **Tailwind CSS**. Los primeros meses no debería costarte nada (ver "Costos" al final).

## 0. Lo que vas a necesitar antes de empezar

- Tener [Node.js](https://nodejs.org) instalado en tu computadora (versión 18 o superior). Para revisar si ya lo tienes, abre una terminal y escribe `node -v`.
- Una cuenta gratuita en [supabase.com](https://supabase.com) (la base de datos + login).
- Una cuenta gratuita en [vercel.com](https://vercel.com) (donde va a vivir el sitio publicado).
- Una cuenta en [github.com](https://github.com) (para subir el código y que Vercel lo despliegue).

Ninguna de las tres te va a pedir tarjeta de crédito para el plan gratuito.

## 1. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com), crea una cuenta y luego un **New project**.
2. Ponle un nombre (ej. "portal-viajes"), elige una contraseña para la base de datos (guárdala en algún lado) y espera 1-2 minutos a que se cree.
3. En el menú lateral, ve a **SQL Editor** > **New query**, pega TODO el contenido del archivo `supabase/schema.sql` de este proyecto, y dale **Run**. Esto crea las tablas (perfiles, viajes, itinerario, fotos) y las reglas de seguridad para que cada cliente solo vea sus propios datos.
4. Ve a **Storage** > **New bucket**, ponle de nombre exactamente `trip-photos`, y actívalo como **Public bucket**. Sin este paso las fotos no se van a poder subir.
5. Vuelve al **SQL Editor** y corre la sección "STORAGE (fotos)" que está al final de `schema.sql` (los `create policy` de `storage.objects`) — esto deja que solo el admin pueda subir/borrar fotos, y solo un usuario logeado pueda verlas.
6. Ve a **Project Settings** (ícono de engranaje) > **API**. Ahí vas a ver **Project URL** y la llave **anon public** — los vas a necesitar en el siguiente paso.

## 2. Configurar el proyecto en tu computadora

1. Descomprime este proyecto y ábrelo en una terminal.
2. Copia el archivo `.env.local.example` y renómbralo a `.env.local`.
3. Ábrelo y pega ahí los dos valores que copiaste de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-llave-anon-public
   ```
4. Instala las dependencias:
   ```bash
   npm install
   ```
5. Corre el sitio en tu computadora:
   ```bash
   npm run dev
   ```
6. Abre `http://localhost:3000` en tu navegador. Ya deberías ver la pantalla de inicio.

## 3. Crear el primer usuario administrador (el dueño de la agencia)

Por defecto, TODO usuario que se registra entra como "cliente" — es una medida de seguridad para que nadie se auto-asigne como admin. Por eso el primer admin se activa a mano, una sola vez:

1. En `http://localhost:3000/register`, crea la cuenta del dueño de la agencia (su nombre, correo y contraseña).
2. En Supabase, ve otra vez a **SQL Editor** y corre (cambiando el correo):
   ```sql
   update profiles set role = 'admin'
   where id = (select id from auth.users where email = 'correo-del-dueno@agencia.com');
   ```
3. Cierra sesión y vuelve a entrar en el sitio con ese correo — ahora debería llevarte directo al **Panel de administrador**.

## 4. Cómo se usa

**El dueño de la agencia (admin):**
1. En el panel, da clic en **+ Nuevo viaje**.
2. Elige el cliente de la lista (para que aparezca ahí, el cliente ya se tuvo que haber registrado en `/register` — mándale el link).
3. Escribe el nombre del viaje, destino y fechas, y créalo.
4. Dentro del viaje, agrega los puntos del itinerario (fecha, hora, título, ubicación, detalle) y sube las fotos del cliente.

**El cliente final:**
1. Entra a `/register`, crea su cuenta.
2. Le avisa al admin (o el admin ya sabe que se registró y lo busca en la lista de clientes al crear el viaje).
3. Una vez que el admin le asigna un viaje, el cliente entra a `/login` y ve su itinerario, su calendario y sus fotos.

## 5. Publicar el sitio en internet (Vercel)

1. Crea un repositorio nuevo en GitHub y sube el código de este proyecto (`git init`, `git add .`, `git commit`, y sigue las instrucciones de GitHub para conectarlo y hacer push — o pídeme ayuda con esta parte si se te complica).
2. Entra a [vercel.com](https://vercel.com), inicia sesión con tu cuenta de GitHub, y dale **Add New… > Project**.
3. Elige el repositorio que acabas de subir.
4. Antes de darle **Deploy**, abre **Environment Variables** y agrega las mismas dos variables de tu `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Dale **Deploy**. En 1-2 minutos Vercel te da un link tipo `https://portal-viajes.vercel.app` — ya el sitio está en vivo.
6. (Opcional) Si tu cliente quiere su propio dominio (ej. `portal.suagencia.com`), cómpralo donde prefieras y en Vercel ve a **Settings > Domains** para conectarlo — Vercel te da las instrucciones exactas según dónde compraste el dominio.

Cada vez que quieras actualizar el sitio (un cambio de texto, una función nueva), subes el cambio a GitHub y Vercel lo vuelve a publicar solo.

## Costos

- **Supabase** (base de datos + login + fotos): plan gratuito cubre hasta 500MB de base de datos y 1GB de almacenamiento de archivos — de sobra para empezar con varios clientes. Si crece mucho, el siguiente plan es $25/mes.
- **Vercel** (hosting): el plan gratuito (Hobby) alcanza perfectamente para este tipo de sitio.
- **Dominio propio** (opcional): entre $10 y $20 al año, aparte.

Es decir: puedes tener esto funcionando y publicado en internet sin pagar nada, hasta que el negocio del cliente crezca lo suficiente para justificar un plan pago.

## Estructura del proyecto (por si quieres tocar algo)

- `supabase/schema.sql` — toda la base de datos y las reglas de seguridad.
- `src/app/admin/` — panel de administrador.
- `src/app/portal/` — lo que ve el cliente final.
- `src/app/login`, `src/app/register` — autenticación.
- `src/components/Calendar.js` — el calendario mensual.
- `src/lib/supabase/` — la conexión con Supabase (no debería hacer falta tocarlo).

Si quieres agregarle algo (notificaciones, pagos, reseñas, más de un admin, etc.), dime y seguimos construyendo sobre esta misma base.
