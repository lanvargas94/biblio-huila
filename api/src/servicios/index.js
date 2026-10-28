// Arma los servicios con sus repositorios. Lo usan server.js y las pruebas.
const { crearRepositorioLibros } = require('../repositorios/libros.repositorio')
const { crearRepositorioPrestamos } = require('../repositorios/prestamos.repositorio')
const { crearServicioLibros } = require('./libros.servicio')
const { crearServicioPrestamos } = require('./prestamos.servicio')

function crearServicios(db) {
  const libros = crearRepositorioLibros(db)
  const prestamos = crearRepositorioPrestamos(db)
  return {
    libros: crearServicioLibros({ libros }),
    prestamos: crearServicioPrestamos({ libros, prestamos }),
  }
}

module.exports = { crearServicios }
