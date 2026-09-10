-- Adds the project card tag column (replaces the old metrics-hijack pattern
-- of storing {"name": "Featured", "value": "Project"} inside `metrics`).
-- init_db()/create_all() will NOT alter an existing table, so run this by
-- hand against the live database.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS tag TEXT NOT NULL DEFAULT 'other';

-- Optional cleanup: after setting `tag` on each project, strip any
-- {"name": "Featured", "value": "Project"} entries left over in `metrics`
-- from the old workaround, e.g.:
--
-- UPDATE projects
-- SET metrics = (
--   SELECT jsonb_agg(m) FROM jsonb_array_elements(metrics) m
--   WHERE m->>'name' <> 'Featured'
-- )
-- WHERE metrics @> '[{"name": "Featured"}]';

-- Mark specific projects as featured, e.g.:
-- UPDATE projects SET tag = 'featured' WHERE slug = 'oncovision-ai';
