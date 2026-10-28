// Arma los servicios con sus repositorios. Lo usan server.js y las pruebas.
const { crearRepositorioLibros } = require('../repositorios/libros.repositorio')
const { crearRepositorioPrestamos } = require('../repositorios/prestamos.repositorio')
const { crearServicioLibros } = require('./libros.servicio')
const { crearServicioPrestamos } = require('./prestamos.servicio')

// `ahora` permite que las pruebas controlen el reloj; en producción es la hora real.
function crearServicios(db, { ahora = () => new Date() } = {}) {
  const libros = crearRepositorioLibros(db)
  const prestamos = crearRepositorioPrestamos(db)
  return {
    libros: crearServicioLibros({ libros }),
    prestamos: crearServicioPrestamos({ libros, prestamos, ahora }),
  }
}

module.exports = { crearServicios }
