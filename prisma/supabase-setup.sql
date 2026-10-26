-- ==============================================================================
-- SUPABASE POSTGRESQL SETUP FOR REALTIME & SCHEMA ACCESS
-- Run this SQL in Supabase SQL Editor or direct postgres connection
-- ==============================================================================

-- 1. Berikan hak akses schema ke role publik Supabase
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Berikan hak SELECT untuk tabel-tabel utama yang disubscribe Realtime
GRANT SELECT ON public.warga TO anon, authenticated, service_role;
GRANT SELECT ON public.notifications TO anon, authenticated, service_role;
GRANT SELECT ON public.found_items TO anon, authenticated, service_role;
GRANT SELECT ON public.lost_reports TO anon, authenticated, service_role;
GRANT SELECT ON public.claim_transactions TO anon, authenticated, service_role;

-- 3. Berikan hak default untuk tabel-tabel yang dibuat di masa mendatang
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;

-- 4. Set REPLICA IDENTITY FULL agar payload DELETE & UPDATE menyertakan seluruh data
ALTER TABLE public.warga REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.found_items REPLICA IDENTITY FULL;
ALTER TABLE public.lost_reports REPLICA IDENTITY FULL;
ALTER TABLE public.claim_transactions REPLICA IDENTITY FULL;

-- 5. Tambahkan tabel ke publikasi supabase_realtime secara idempoten
DO $$
DECLARE
  t text;
  tables text[] := ARRAY['warga', 'notifications', 'found_items', 'lost_reports', 'claim_transactions'];
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  FOREACH t IN ARRAY tables LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', t);
    END IF;
  END LOOP;
END $$;
