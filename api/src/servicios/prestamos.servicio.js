// Casos de uso de préstamos: aplican las reglas de la biblioteca (reglas.js)
// sin saber nada de HTTP ni de SQL.
const { ErrorDeNegocio } = require('../errores')
const { MAX_PRESTAMOS_POR_LECTOR, calcularVencimiento, calcularMulta } = require('./reglas')

function crearServicioPrestamos({ libros, prestamos, ahora }) {
  function prestar({ lector, libroId }) {
    const libro = libros.buscarPorId(libroId)
    if (!libro) throw new ErrorDeNegocio('el libro no existe', 404)
    if (prestamos.contarActivosDeLector(lector) >= MAX_PRESTAMOS_POR_LECTOR) {
      throw new ErrorDeNegocio(`el lector ya tiene ${MAX_PRESTAMOS_POR_LECTOR} libros prestados`, 409)
    }
    if (prestamos.contarActivosDeLibro(libro.id) >= libro.ejemplares) {
      throw new ErrorDeNegocio('no hay ejemplares disponibles', 409)
    }
    const hoy = ahora()
    const vence = calcularVencimiento(hoy)
    const id = prestamos.crear({ libroId: libro.id, lector, fecha: hoy.toISOString(), vence: vence.toISOString() })
    return { id, libro: libro.titulo, lector, vence: vence.toISOString() }
  }

  function devolver(id) {
    const prestamo = prestamos.buscarPorId(id)
    if (!prestamo) throw new ErrorDeNegocio('el préstamo no existe', 404)
    if (prestamo.devuelto) throw new ErrorDeNegocio('el préstamo ya fue devuelto', 409)
    const multa = calcularMulta(prestamo.vence, ahora())
    prestamos.marcarDevuelto(prestamo.id, multa)
    return { id: prestamo.id, multa }
  }

  function vencidos() {
    const hoy = ahora()
    return prestamos.listarActivos()
      .map((prestamo) => ({ ...prestamo, multa: calcularMulta(prestamo.vence, hoy) }))
      .filter((prestamo) => prestamo.multa > 0)
  }

  return { listar: () => prestamos.listar(), prestar, devolver, vencidos }
}

module.exports = { crearServicioPrestamos }
