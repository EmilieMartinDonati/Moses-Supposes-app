ALTER TABLE writing_workshops
  ADD COLUMN status text NOT NULL DEFAULT 'draft'
  CHECK (status IN ('draft', 'published', 'closed', 'archived'));

UPDATE writing_workshops SET status = 'published';