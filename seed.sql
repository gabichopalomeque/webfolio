-- ============================================================================
-- GABRIEL PALOMEQUE — PORTAFOLIO
-- Datos reales (seed) — correr DESPUÉS de schema.sql
-- ============================================================================
-- Esto llena tus tablas con todo el contenido ya aprobado: Hero, Formación,
-- Experiencia, Showreels y las 7 subsecciones de Mi Trabajo. Después de
-- correrlo, tu sitio va a mostrar contenido real desde el primer momento —
-- y podrás editar cualquier cosa desde el panel /admin.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- HERO (actualiza la fila que ya existe)
-- ---------------------------------------------------------------------------
update sections set
  eyebrow = 'Diseño Gráfico & Multimedia',
  title = 'Gabriel Palomeque',
  lead_text = 'Apasionado por la creación visual y el entorno multimedia. Busco siempre el equilibrio entre la estética y la funcionalidad para lograr un impacto real. Aporto soluciones técnicas y comunicación clara para que el trabajo fluya y alcance su mejor versión.',
  extra = '{
    "wordmark": "Portafolio",
    "cta_label": "Ver mi trabajo",
    "stat_number": "3",
    "stat_text": "Años de experiencia",
    "photo_url": "/assets/hero/photo.webp",
    "video_url": "/assets/hero/bg.mp4",
    "specialties": ["Diseño Social Media","Video publicitario","Diseño web","Fotografía profesional","Manejo avanzado de IA","Diseño 3D","Marketing digital"]
  }'::jsonb
where slug = 'hero';

-- ---------------------------------------------------------------------------
-- EXPERIENCIA (actualiza extra con el video de fondo)
-- ---------------------------------------------------------------------------
update sections set
  extra = '{"video_url": "/assets/experiencia/bg.mp4"}'::jsonb
where slug = 'experiencia';

-- ---------------------------------------------------------------------------
-- FORMACIÓN — línea de tiempo
-- ---------------------------------------------------------------------------
insert into formacion_timeline (group_name, date_label, title, institution, sort_order) values
  ('educacion', 'Feb 2024', 'Tecnólogo Superior en Diseño Gráfico', 'Instituto Tecnológico Superior Sudamericano', 1),
  ('educacion', 'Ago 2020', 'Bachiller en Ciencias Básicas', 'Unidad Educativa Manuel J. Calle', 2),
  ('continua', 'Feb 2025', 'Seminario de Creación de Contenidos con IA', 'Universidad Politécnica de Loja', 1),
  ('continua', 'Ago 2024', 'Seminario de IA para Community Managers', 'Academia Go Design', 2),
  ('continua', 'Ago 2024', 'Community Manager & Marketing Digital', 'Academia Go Design', 3);

-- FORMACIÓN — áreas de diseño
insert into formacion_areas (title, sort_order) values
  ('Diseño publicitario', 1),
  ('Video publicitario', 2),
  ('Diseño web', 3),
  ('Fotografía profesional', 4),
  ('Manejo avanzado de IA', 5),
  ('Diseño 3D', 6);

-- FORMACIÓN — herramientas
insert into formacion_tools (label, monogram, sort_order) values
  ('Photoshop', 'Ps', 1),
  ('Illustrator', 'Ai', 2),
  ('InDesign', 'Id', 3),
  ('Canva', 'Cv', 4),
  ('Premiere Pro', 'Pr', 5),
  ('After Effects', 'Ae', 6),
  ('CapCut', 'Cc', 7),
  ('WordPress', 'Wp', 8),
  ('Meta Business Suite', 'Mb', 9),
  ('Claude', 'Cl', 10),
  ('Gemini', 'Ge', 11),
  ('Magnific', 'Mg', 12),
  ('Blender', 'Bl', 13);

-- ---------------------------------------------------------------------------
-- EXPERIENCIA — historial laboral
-- ---------------------------------------------------------------------------
insert into experiencia_items (date_range, role, organization, description, sort_order) values
  ('Dic 2024 — Jul 2026', 'Diseñador Gráfico y Fotógrafo de Planta', 'Forxa Inmobiliaria',
   'Desarrollé la identidad visual mediante la creación de piezas gráficas para redes sociales, campañas publicitarias y materiales de comunicación interna. Produje contenido audiovisual —videos creativos y recorridos inmobiliarios— y realicé fotografía profesional de inmuebles, incorporando tomas aéreas con dron. Diseñé materiales impresos como carnets, banners, folletos y fichas técnicas, asegurando una presentación coherente y atractiva de la empresa.', 1),
  ('2025 — 2026', 'Fotógrafo y Videógrafo', 'CAINEC — Cámara Inmobiliaria Ecuatoriana',
   'Cobertura fotográfica y audiovisual oficial de INMOTRENDS, el evento de mayor convocatoria a nivel nacional para corredores inmobiliarios en Ecuador. Documenté las ediciones 2025 y 2026, capturando conferencias, paneles y momentos clave para las comunicaciones institucionales del gremio.', 2),
  ('Nov 2024', 'Creación de Contenido para Redes Sociales', 'Virreina Miss Beauty Universal — Karla Arellano',
   'Realicé la creación de contenido, incluyendo cobertura fotográfica y producción de videos conmemorativos. Capturé momentos clave de su participación y elaboré contenido audiovisual para redes sociales, fortaleciendo su presencia digital con materiales visuales de alta calidad y enfoque estético.', 3),
  ('Sep — Nov 2024', 'Diseñador Gráfico y Fotógrafo de Planta', 'Showroom Danibel Outfits',
   'Gestioné redes sociales con enfoque en interacción orgánica, sin uso de publicidad pagada, creando contenido atractivo y alineado a los objetivos de la marca. Realicé videos, fotografías y diseños publicitarios, generando una presencia digital coherente y fortaleciendo el vínculo con la audiencia de manera auténtica y constante.', 4),
  ('Sep 2023 — Ago 2024', 'Desarrollo Web y Creación de Contenido', 'PUMA Constructora e Inmobiliaria',
   'Realicé la creación de contenido y diseño publicitario, desarrollando videos, fotografía profesional, diseños gráficos y copywriting publicitario enfocados en la identidad de la empresa. Diseñé tarjetas de presentación y papelería, y desarrollé su página web, asegurando una presencia virtual sólida.', 5);

-- EXPERIENCIA — referencias profesionales
insert into experiencia_references (name, role, organization, phone, sort_order) values
  ('Ing. Daniela Vizhñay', 'Directora de Marketing', 'Forxa Inmobiliaria', '098 101 5089', 1),
  ('Lic. Paola Rodríguez', 'Directora Creativa', 'Artkham Estudio de Arte', '099 526 4634', 2);

-- ---------------------------------------------------------------------------
-- SHOWREELS — videos de YouTube
-- ---------------------------------------------------------------------------
insert into showreels_items (youtube_id, sort_order) values
  ('uNxIh6tTUfE', 1),
  ('T_uu7DjaFms', 2),
  ('EwV2lv0ovBI', 3),
  ('tyUHD69RnmI', 4),
  ('ICREMF73ZS8', 5),
  ('gmmapn_vYD4', 6),
  ('nt0bGrgxke4', 7),
  ('PtwSvdiOTOA', 8),
  ('X7ho1Ix6bcE', 9),
  ('g_LVG4hezLQ', 10);

-- ============================================================================
-- MI TRABAJO — 7 subsecciones
-- ============================================================================

-- 01 · Comunicación Estratégica (orbit globe, 12 piezas)
with cat as (
  insert into work_categories (number_label, title, lead_text, layout, sort_order)
  values ('01', 'Comunicación Estratégica',
    'Más que estética, el diseño es una herramienta de negocios. Mantener una presencia digital activa, profesional y visualmente impecable es el reflejo directo del compromiso de una marca con la excelencia y la innovación.',
    'orbit', 1)
  returning id
)
insert into work_items (category_id, item_type, title, image_url, sort_order)
select id, 'image', v.title, v.image_url, v.sort_order
from cat, (values
  ('Diseño para Arq. Carlos Guillén — Arquitectura y Valor', '/assets/work/orbit-01.jpg', 1),
  ('AURA Inversiones Seguras — Suites y Deptos', '/assets/work/orbit-02.jpg', 2),
  ('AURA — Donde nacen tus momentos', '/assets/work/orbit-03.jpg', 3),
  ('AURA — No es solo un departamento', '/assets/work/orbit-04.jpg', 4),
  ('Mirador de Misicata — El hogar que siempre deseaste', '/assets/work/orbit-05.jpg', 5),
  ('Mirador de Misicata — Sector Antenas de Misicata', '/assets/work/orbit-06.jpg', 6),
  ('Mirador de Misicata — Eleva tu manera de vivir', '/assets/work/orbit-07.jpg', 7),
  ('CAINEC — Stand InmoTRENDS 2025', '/assets/work/orbit-08.jpg', 8),
  ('Forxa Inmobiliaria — Día del Orgullo Ecuatoriano', '/assets/work/orbit-09.jpg', 9),
  ('Doña Burger — Promoción margarita gratis', '/assets/work/orbit-10.jpg', 10),
  ('Doña Burger — Estamos ON', '/assets/work/orbit-11.jpg', 11),
  ('Artkham Estudio de Arte — Fotografía de escultura', '/assets/work/orbit-12.jpg', 12)
) as v(title, image_url, sort_order);

-- 02 · Identidad y Papelería
with cat as (
  insert into work_categories (number_label, title, lead_text, layout, sort_order)
  values ('02', 'Identidad y Papelería',
    'Lo primero que alguien toca de una marca. Tarjetas de presentación y carnet corporativo para el equipo de Forxa, pensados para que cada encuentro arranque con el pie derecho.',
    'grid-2', 2)
  returning id
)
insert into work_items (category_id, item_type, title, image_url, sort_order)
select id, 'image', v.title, v.image_url, v.sort_order
from cat, (values
  ('Forxa Inmobiliaria — Tarjetas de presentación', '/assets/work/work-biz.jpg', 1),
  ('Forxa Inmobiliaria — Carnet corporativo', '/assets/work/work-idc.jpg', 2)
) as v(title, image_url, sort_order);

-- 03 · Publicidad Exterior
with cat as (
  insert into work_categories (number_label, title, lead_text, layout, sort_order)
  values ('03', 'Publicidad Exterior',
    'Una valla no tiene segunda oportunidad: el mensaje se lee en el tiempo que dura un semáforo. Diseño de vía pública para AURA Inversiones Seguras.',
    'grid-1', 3)
  returning id
)
insert into work_items (category_id, item_type, title, image_url, sort_order)
select id, 'image', 'AURA Inversiones Seguras — Valla publicitaria', '/assets/work/work-bill.jpg', 1
from cat;

-- 04 · Material Editorial
with cat as (
  insert into work_categories (number_label, title, lead_text, layout, sort_order)
  values ('04', 'Material Editorial',
    'No todo se resuelve en una pantalla. El brochure de Mirador de Misicata acompaña la venta cara a cara, con la misma identidad de marca trasladada al papel.',
    'grid-1', 4)
  returning id
)
insert into work_items (category_id, item_type, title, image_url, sort_order)
select id, 'image', 'Mirador de Misicata — Brochure del proyecto', '/assets/work/work-book.jpg', 1
from cat;

-- 05 · Campañas en Redes Sociales
with cat as (
  insert into work_categories (number_label, title, lead_text, layout, sort_order)
  values ('05', 'Campañas en Redes Sociales',
    'Series pensadas para el scroll: una misma idea que se sostiene publicación tras publicación, sin perder el hilo de la marca.',
    'grid-2', 5)
  returning id
)
insert into work_items (category_id, item_type, title, image_url, sort_order)
select id, 'image', v.title, v.image_url, v.sort_order
from cat, (values
  ('Forxa Inmobiliaria — Serie ''Navega con nosotros''', '/assets/work/work-ig1.jpg', 1),
  ('AURA Inversiones Seguras — Serie de avance de obra', '/assets/work/work-ig2.jpg', 2)
) as v(title, image_url, sort_order);

-- 06 · Diseño Web (embebidos e interactivos)
with cat as (
  insert into work_categories (number_label, title, lead_text, layout, note_text, sort_order)
  values ('06', 'Diseño Web',
    'Sitios construidos de cero — estructura, diseño y desarrollo — para que cada proyecto tenga una casa propia en internet. Recórrelos aquí mismo, tal como están publicados.',
    'embeds',
    'Kapitalf y VA Projects están hechos en Wix, que a veces bloquea que su contenido se vea embebido fuera de su propio dominio. Si el cuadro no carga, el botón de "Abrir en pestaña nueva" siempre funciona.',
    6)
  returning id
)
insert into work_items (category_id, item_type, title, subtitle, image_url, embed_url, sort_order)
select id, 'embed', v.title, v.subtitle, v.image_url, v.embed_url, v.sort_order
from cat, (values
  ('Portón del Valle', 'Sitio completo con mapa interactivo de lotes',
   'https://proyectosforxa-portondelvalle.netlify.app/img/aerial-hillside.jpg',
   'https://proyectosforxa-portondelvalle.netlify.app/', 1),
  ('Álabes', 'Sitio del proyecto residencial y comercial',
   'https://proyectosforxa-alabes.netlify.app/img/vista-frontal.jpg',
   'https://proyectosforxa-alabes.netlify.app/', 2),
  ('Kapitalf', 'Sitio corporativo — Torre Alpha',
   'https://static.wixstatic.com/media/6e11c1_9f3d4ce46d37462c9539325010478f25%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/6e11c1_9f3d4ce46d37462c9539325010478f25%7Emv2.jpg',
   'https://www.kapitalf.com/', 3),
  ('VA Projects', 'Sitio de la constructora',
   'https://static.wixstatic.com/media/6b612c_023b75795b0246e3b11b6c553ad3a7e9~mv2.jpg/v1/fill/w_980,h_626,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/6b612c_023b75795b0246e3b11b6c553ad3a7e9~mv2.jpg',
   'https://www.vaprojectsgroup.com/', 4)
) as v(title, subtitle, image_url, embed_url, sort_order);

-- 07 · Recorridos Virtuales 360°
with cat as (
  insert into work_categories (number_label, title, lead_text, layout, sort_order)
  values ('07', 'Recorridos Virtuales 360°',
    'La mejor forma de mostrar un espacio sin estar ahí. Recorridos inmersivos integrados directamente en la página, listos para explorar con el mouse.',
    'embeds', 7)
  returning id
)
insert into work_items (category_id, item_type, title, subtitle, image_url, embed_url, sort_order)
select id, 'embed', v.title, 'Recorrido virtual 360°', v.image_url, v.embed_url, v.sort_order
from cat, (values
  ('Aura Depto',
   'https://assets.panoee.com/statics/uploads/user/69a75259d4ca8a59258e69e2/media/pano/thumb/zjQRTr4yeop7FLLoNKaX.webp',
   'https://tour.panoee.net/69af4118ae5537066bfcde90/69af420cae55375709fcdebd', 1),
  ('Mirador de Misicata',
   'https://assets.panoee.com/statics/uploads/user/69a75259d4ca8a59258e69e2/media/pano/thumb/cVfnVL7w951VPL7d4YG4.webp',
   'https://tour.panoee.net/69b59357cd59188a75139188/salajpg-1', 2),
  ('Portón del Valle',
   'https://assets.panoee.com/statics/uploads/user/696e45decb1262fa56775095/media/pano/thumb/faiRe4SfGD3vIuFFSIOc.webp',
   'https://tour.panoee.net/6a7b4f89123af53a67235346/dji_0009', 3)
) as v(title, image_url, embed_url, sort_order);

-- ============================================================================
-- Fin. Ya puedes ir a "Table Editor" en Supabase y ver todo cargado.
-- ============================================================================
