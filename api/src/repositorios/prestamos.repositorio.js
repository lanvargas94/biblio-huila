// Repositorio: el único lugar que sabe SQL de la tabla prestamos.
const CON_TITULO = 'SELECT p.*, l.titulo FROM prestamos p JOIN libros l ON l.id = p.libro_id'

function crearRepositorioPrestamos(db) {
  return {
    listar() {
      return db.prepare(`${CON_TITULO} ORDER BY p.id DESC`).all()
    },
    listarActivos() {
      return db.prepare(`${CON_TITULO} WHERE p.devuelto = 0 ORDER BY p.vence`).all()
    },
    buscarPorId(id) {
      return db.prepare('SELECT * FROM prestamos WHERE id = ?').get(id)
    },
    contarActivosDeLector(lector) {
      return db.prepare('SELECT COUNT(*) AS n FROM prestamos WHERE lector = ? AND devuelto = 0').get(lector).n
    },
    contarActivosDeLibro(libroId) {
      return db.prepare('SELECT COUNT(*) AS n FROM prestamos WHERE libro_id = ? AND devuelto = 0').get(libroId).n
    },
    crear({ libroId, lector, fecha, vence }) {
      const r = db.prepare('INSERT INTO prestamos (libro_id, lector, fecha, vence) VALUES (?, ?, ?, ?)')
        .run(libroId, lector, fecha, vence)
      return Number(r.lastInsertRowid)
    },
    marcarDevuelto(id, multa) {
      db.prepare('UPDATE prestamos SET devuelto = 1, multa = ? WHERE id = ?').run(multa, id)
    },
  }
}

module.exports = { crearRepositorioPrestamos }
