// Conexión y esquema. Solo este archivo sabe dónde vive la base;
// ':memory:' sirve para las pruebas.
const fs = require('node:fs')
const path = require('node:path')
const { DatabaseSync } = require('node:sqlite')

const SEMILLA = [
  ['La vorágine', 'José Eustasio Rivera', 2],
  ['Cien años de soledad', 'Gabriel García Márquez', 3],
  ['María', 'Jorge Isaacs', 1],
  ['El olvido que seremos', 'Héctor Abad Faciolince', 2],
]

function abrir(ruta) {
  if (ruta !== ':memory:') fs.mkdirSync(path.dirname(ruta), { recursive: true })
  const db = new DatabaseSync(ruta)
  db.exec(`
    CREATE TABLE IF NOT EXISTS libros (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo     TEXT    NOT NULL,
      autor      TEXT    NOT NULL,
      ejemplares INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS prestamos (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      libro_id INTEGER NOT NULL REFERENCES libros(id),
      lector   TEXT    NOT NULL,
      fecha    TEXT    NOT NULL,
      vence    TEXT    NOT NULL,
      devuelto INTEGER NOT NULL DEFAULT 0,
      multa    INTEGER NOT NULL DEFAULT 0
    );
  `)
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM libros').get()
  if (n === 0) {
    const insertar = db.prepare('INSERT INTO libros (titulo, autor, ejemplares) VALUES (?, ?, ?)')
    for (const libro of SEMILLA) insertar.run(...libro)
  }
  return db
}

module.exports = { abrir }
