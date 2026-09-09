// ============================================================================
// Configuración de Supabase
// La "anon key" es pública por diseño — está protegida por las políticas de
// seguridad (RLS) que corriste en schema.sql: cualquiera puede LEER, pero
// solo un usuario logueado (tú, desde /admin) puede ESCRIBIR.
// ============================================================================
const SUPABASE_URL = 'https://oqemytfahhwjumjdgklv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZW15dGZhaGh3anVtamRna2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4OTExNzgsImV4cCI6MjEwNDQ2NzE3OH0.zMfBHbLbpVRe40Pxc_5vCFBsgg37LFw-Su5-w6aPTW8';
