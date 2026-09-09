-- ============================================================================
-- Arreglo puntual: el párrafo de Formación quedó vacío en el seed original.
-- Corre esto UNA vez en el SQL Editor de Supabase (no vuelve a duplicar nada,
-- es solo un UPDATE).
-- ============================================================================
update sections set
  lead_text = 'Mi formación combina un título de Tecnólogo en Diseño Gráfico con actualización constante en herramientas y flujos de trabajo con inteligencia artificial — la misma curiosidad que aplico en cada proyecto.'
where slug = 'formacion';
