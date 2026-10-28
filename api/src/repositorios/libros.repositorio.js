// Repositorio: el único lugar que sabe SQL de la tabla libros.
function crearRepositorioLibros(db) {
  return {
    listar(texto) {
      return texto
        ? db.prepare('SELECT * FROM libros WHERE titulo LIKE ? ORDER BY id').all('%' + texto + '%')
        : db.prepare('SELECT * FROM libros ORDER BY id').all()
    },
    buscarPorId(id) {
      return db.prepare('SELECT * FROM libros WHERE id = ?').get(id)
    },
    crear({ titulo, autor, ejemplares }) {
      const r = db.prepare('INSERT INTO libros (titulo, autor, ejemplares) VALUES (?, ?, ?)').run(titulo, autor, ejemplares)
      return Number(r.lastInsertRowid)
    },
  }
}

module.exports = { crearRepositorioLibros }
