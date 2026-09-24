/*
# Storage policies for site-media bucket

1. Security
- SELECT (read): allow anon + authenticated — public site needs to display uploaded images
- INSERT/UPDATE/DELETE: authenticated only — admin panel uploads after sign-in
*/

DROP POLICY IF EXISTS "read_site_media" ON storage.objects;
CREATE POLICY "read_site_media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-media');

DROP POLICY IF EXISTS "insert_site_media" ON storage.objects;
CREATE POLICY "insert_site_media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-media');

DROP POLICY IF EXISTS "update_site_media" ON storage.objects;
CREATE POLICY "update_site_media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-media') WITH CHECK (bucket_id = 'site-media');

DROP POLICY IF EXISTS "delete_site_media" ON storage.objects;
CREATE POLICY "delete_site_media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-media');
