-- users moved to the shared accounts database (prmagana/root). forms still keys on the Telegram id,
-- but SQLite can't drop a foreign key in place, so rebuild forms without it, then drop users.
PRAGMA defer_foreign_keys = true;

CREATE TABLE forms_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  frames TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO forms_new (id, user_id, name, created_at, frames)
  SELECT id, user_id, name, created_at, frames FROM forms;
DROP TABLE forms;
ALTER TABLE forms_new RENAME TO forms;
CREATE INDEX forms_user_id ON forms(user_id);

DROP TABLE users;
