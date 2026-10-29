-- The form's frames, in order, as a JSON array. The editor's draft; '[]' until the first frame.
ALTER TABLE forms ADD COLUMN frames TEXT NOT NULL DEFAULT '[]';
