// Casos de uso de préstamos: aquí viven las reglas de la biblioteca,
// sin saber nada de HTTP ni de SQL.
const { ErrorDeNegocio } = require('../errores')

function crearServicioPrestamos({ libros, prestamos }) {
  function prestar({ lector, libroId }) {
    const libro = libros.buscarPorId(libroId)
    if (!libro) throw new ErrorDeNegocio('no existe', 404)
    if (prestamos.contarActivosDeLector(lector) >= 3) throw new ErrorDeNegocio('el lector ya tiene 3 libros')
    if (prestamos.contarActivosDeLibro(libro.id) >= libro.ejemplares) throw new ErrorDeNegocio('no hay ejemplares')
    var hoy = new Date()
    var vence = new Date(hoy.getTime() + 15 * 24 * 60 * 60 * 1000)
    const id = prestamos.crear({ libroId: libro.id, lector, fecha: hoy.toISOString(), vence: vence.toISOString() })
    return { id, vence }
  }

  function devolver(id) {
    const p = prestamos.buscarPorId(id)
    if (!p) throw new ErrorDeNegocio('no existe', 404)
    var hoy = new Date()
    var dias = Math.floor((hoy.getTime() - new Date(p.vence).getTime()) / (24 * 60 * 60 * 1000))
    var multa = 0
    if (dias > 0) multa = dias * 1500
    prestamos.marcarDevuelto(p.id, multa)
    return { ok: true, multa }
  }

  function vencidos() {
    const todos = prestamos.listarActivos()
    var lista = []
    for (var i = 0; i < todos.length; i++) {
      var hoy = new Date()
      var dias = Math.floor((hoy.getTime() - new Date(todos[i].vence).getTime()) / (24 * 60 * 60 * 1000))
      if (dias > 0) {
        todos[i].multa = dias * 1500
        lista.push(todos[i])
      }
    }
    return lista
  }

  return { listar: () => prestamos.listar(), prestar, devolver, vencidos }
}

module.exports = { crearServicioPrestamos }
