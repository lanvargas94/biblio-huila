// Casos de uso del catálogo.
function crearServicioLibros({ libros }) {
  return {
    listar: (texto) => libros.listar(texto),
    crear(datos) {
      const id = libros.crear(datos)
      return { id }
    },
  }
}

module.exports = { crearServicioLibros }
