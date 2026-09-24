/*
# Create site_content table for AGI Cards website

1. New Tables
- `site_content`: stores the entire editable site document (pages, sections, settings) as a JSON blob.
  - `id` (text, primary key) — single row with id 'main'
  - `data` (jsonb, not null) — the full SiteContent object
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `site_content`.
- SELECT: allow anon + authenticated (public site reads content without login)
- INSERT/UPDATE/DELETE: authenticated only (admin panel writes after sign-in)
- Storage bucket `site-media` is created for image uploads.
*/

CREATE TABLE IF NOT EXISTS site_content (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_site_content" ON site_content;
CREATE POLICY "read_site_content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "insert_site_content" ON site_content;
CREATE POLICY "insert_site_content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "update_site_content" ON site_content;
CREATE POLICY "update_site_content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_site_content" ON site_content;
CREATE POLICY "delete_site_content"
  ON site_content FOR DELETE
  TO authenticated
  USING (true);

-- Insert default row if it doesn't exist
INSERT INTO site_content (id, data, updated_at)
SELECT 'main', '{}'::jsonb, now()
WHERE NOT EXISTS (SELECT 1 FROM site_content WHERE id = 'main');
