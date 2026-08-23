CREATE TABLE usuarios (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  plan          TEXT NOT NULL,
  metodo_pago   TEXT NOT NULL,
  creado_en     TEXT NOT NULL DEFAULT (datetime('now'))
);
