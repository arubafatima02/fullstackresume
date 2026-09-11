/*
# Create projects table for ARB TECH resume site

1. New Tables
- `projects`
  - `id` (uuid, primary key)
  - `title` (text, not null) — project name
  - `description` (text, not null) — project description
  - `tech_stack` (text[]) — array of technologies used
  - `category` (text, not null) — 'project', 'video', or 'post'
  - `link` (text) — optional external URL
  - `image_url` (text) — optional image URL
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `projects`.
- Allow anon + authenticated to read (public portfolio data).
- Only authenticated users can insert/update/delete (admin operations).

3. Notes
- Public reads use `TO anon, authenticated` so the portfolio displays for all visitors.
- Writes are restricted to `authenticated` users (admin panel access).
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  tech_stack text[] DEFAULT '{}',
  category text NOT NULL DEFAULT 'project',
  link text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access for all visitors
DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects"
  ON projects FOR SELECT
  TO anon, authenticated USING (true);

-- Authenticated users can insert (admin)
DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects"
  ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

-- Authenticated users can update (admin)
DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects"
  ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Authenticated users can delete (admin)
DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects"
  ON projects FOR DELETE
  TO authenticated USING (true);

-- Seed initial featured projects
INSERT INTO projects (title, description, tech_stack, category, link) VALUES
  ('Sovereign AIOS Architecture', 'Next-generation AI operating system architecture built on Gemma 4 with Python backend and cutting-edge UI design for autonomous AI workflows.', ARRAY['Gemma 4', 'Python', 'Next-Gen UI'], 'project', 'https://aroob.netlify.app'),
  ('ARB Sender Utility', 'Security-focused multi-channel messaging utility with API integrations, encrypted payloads, and JavaScript-powered automation pipeline.', ARRAY['Security', 'API Integrations', 'JavaScript'], 'project', 'https://github.com/itsarooba5'),
  ('Chatme Portal', 'Real-time chat portal built on Node.js with glassmorphism UI design, WebSocket communication, and seamless multi-user conversation flows.', ARRAY['Node.js', 'Real-Time UI', 'Glassmorphism'], 'project', 'https://aroob.netlify.app')
ON CONFLICT DO NOTHING;