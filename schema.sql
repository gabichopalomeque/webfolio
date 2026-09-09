-- ============================================================================
-- GABRIEL PALOMEQUE — PORTAFOLIO
-- Esquema de base de datos para Supabase
-- ============================================================================
-- Cómo usar:
-- 1. Entra a tu proyecto en supabase.com → SQL Editor → New query
-- 2. Pega TODO este archivo y dale "Run"
-- 3. Ve a Authentication → Users → Add user, y crea tu usuario admin
--    (ese correo y contraseña serán tu login en /admin)
-- 4. Ve a Project Settings → API y copia:
--    - Project URL
--    - anon public key
--    Esos dos valores son los que me vas a pasar.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. site_settings — datos que se repiten en todo el sitio (nav, footer, CTA)
-- ---------------------------------------------------------------------------
create table site_settings (
  id int primary key default 1,
  brand_name text not null default 'Gabriel Palomeque',
  whatsapp_number text not null default '593998386184',   -- solo dígitos, con código de país, sin +
  whatsapp_message text not null default 'Hola Gabriel, vi tu portafolio y me gustaría conversar sobre un proyecto.',
  email text not null default 'gabichopalomeque@gmail.com',
  phone_display text not null default '+593 998 386 184',
  behance_url text not null default 'https://www.behance.net/gabrielpalomeque',
  city_text text not null default 'Cuenca, Ecuador',
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1);

-- ---------------------------------------------------------------------------
-- 2. sections — copy (eyebrow / título / párrafo) de cada sección de la página
--    slug identifica cuál sección es. "extra" guarda campos propios de esa
--    sección que no aplican a las demás (ej: el video de fondo de Experiencia).
-- ---------------------------------------------------------------------------
create table sections (
  slug text primary key,          -- 'hero' | 'formacion' | 'experiencia' | 'showreels' | 'mi_trabajo' | 'contacto'
  eyebrow text,
  title text,
  lead_text text,
  extra jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into sections (slug, eyebrow, title, lead_text, extra) values
  ('hero', 'Portafolio', 'Gabriel Palomeque', 'Diseño, fotografía y video para marcas que quieren verse tan bien como se sienten.',
    '{"cta_label": "Ver mi trabajo"}'),
  ('formacion', 'Formación', 'Mi formación', '',
    '{}'),
  ('experiencia', 'Experiencia', 'Trayectoria profesional',
    'Con tres años de experiencia transformando identidades visuales. Mi objetivo es elevar cada marca a su máxima expresión, diseñando soluciones elegantes que trascienden lo visual para convertirse en una experiencia memorable que conecta y se siente.',
    '{"video_url": ""}'),
  ('showreels', 'Video', 'Showreels', 'Mira mi trabajo en movimiento.',
    '{}'),
  ('mi_trabajo', 'Mi Trabajo', 'Comunicación Estratégica',
    'Más que estética, el diseño es una herramienta de negocios. Mantener una presencia digital activa, profesional y visualmente impecable es el reflejo directo del compromiso de una marca con la excelencia y la innovación.',
    '{}'),
  ('contacto', 'Contacto', 'Démosle vida a tu proyecto', 'Fotografía, video y diseño — desde Cuenca, Ecuador, para donde te propongas.',
    '{}');

-- ---------------------------------------------------------------------------
-- 3. formacion_timeline — línea de tiempo de Formación (educación + cursos)
-- ---------------------------------------------------------------------------
create table formacion_timeline (
  id uuid primary key default gen_random_uuid(),
  group_name text not null check (group_name in ('educacion','continua')),
  date_label text not null,        -- ej. "Feb 2024"
  title text not null,
  institution text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- 4. formacion_areas — tarjetas de "Áreas de diseño"
-- ---------------------------------------------------------------------------
create table formacion_areas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- 5. formacion_tools — tarjetas de herramientas (Ps, Ai, Id, etc.)
-- ---------------------------------------------------------------------------
create table formacion_tools (
  id uuid primary key default gen_random_uuid(),
  label text not null,             -- nombre completo, ej. "Photoshop"
  monogram text not null,          -- ej. "Ps"
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- 6. experiencia_items — tarjetas de experiencia laboral
-- ---------------------------------------------------------------------------
create table experiencia_items (
  id uuid primary key default gen_random_uuid(),
  date_range text not null,        -- ej. "Dic 2024 — Jul 2026"
  role text not null,
  organization text not null,
  description text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- 7. experiencia_references — referencias profesionales
-- ---------------------------------------------------------------------------
create table experiencia_references (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  organization text not null,
  phone text not null,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- 8. showreels_items — videos del carrusel (IDs de YouTube)
-- ---------------------------------------------------------------------------
create table showreels_items (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null,
  title text,
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- 9. work_categories — subsecciones de "Mi Trabajo"
--    layout: 'orbit' (esfera 3D) | 'grid-2' | 'grid-1' | 'embeds'
-- ---------------------------------------------------------------------------
create table work_categories (
  id uuid primary key default gen_random_uuid(),
  number_label text,               -- ej. "02"
  title text not null,
  lead_text text,
  layout text not null default 'grid-2' check (layout in ('orbit','grid-2','grid-1','embeds')),
  note_text text,                  -- nota pequeña opcional (ej. aviso de Wix)
  sort_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- 10. work_items — piezas dentro de cada categoría de trabajo
--     item_type 'image'  → usa image_url
--     item_type 'embed'  → usa embed_url (sitio o tour 360°) + image_url como portada
-- ---------------------------------------------------------------------------
create table work_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references work_categories(id) on delete cascade,
  item_type text not null default 'image' check (item_type in ('image','embed')),
  title text not null,
  subtitle text,                   -- ej. "Sitio completo con mapa interactivo de lotes"
  image_url text,
  embed_url text,
  sort_order int not null default 0
);

create index on work_items (category_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- Regla general: cualquiera puede LEER (para que el sitio público funcione),
-- solo un usuario autenticado (tú, desde /admin) puede ESCRIBIR.
-- ============================================================================

alter table site_settings enable row level security;
alter table sections enable row level security;
alter table formacion_timeline enable row level security;
alter table formacion_areas enable row level security;
alter table formacion_tools enable row level security;
alter table experiencia_items enable row level security;
alter table experiencia_references enable row level security;
alter table showreels_items enable row level security;
alter table work_categories enable row level security;
alter table work_items enable row level security;

-- Lectura pública en todas las tablas
create policy "public read" on site_settings for select using (true);
create policy "public read" on sections for select using (true);
create policy "public read" on formacion_timeline for select using (true);
create policy "public read" on formacion_areas for select using (true);
create policy "public read" on formacion_tools for select using (true);
create policy "public read" on experiencia_items for select using (true);
create policy "public read" on experiencia_references for select using (true);
create policy "public read" on showreels_items for select using (true);
create policy "public read" on work_categories for select using (true);
create policy "public read" on work_items for select using (true);

-- Escritura (insert/update/delete) solo para usuarios autenticados
create policy "admin write" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on sections for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on formacion_timeline for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on formacion_areas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on formacion_tools for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on experiencia_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on experiencia_references for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on showreels_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on work_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write" on work_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE — bucket público para fotos y videos que subas desde el panel
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "admin upload media" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ============================================================================
-- Fin. Después de correr esto:
-- 1. Crea tu usuario admin en Authentication → Users → Add user
-- 2. Copia Project URL + anon public key desde Project Settings → API
-- 3. Pásamelos para terminar de armar el sitio y el panel
-- ============================================================================
