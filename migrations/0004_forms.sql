-- id is the public form id used in URLs and, later, embeds.
CREATE TABLE forms (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX forms_user_id ON forms(user_id);
