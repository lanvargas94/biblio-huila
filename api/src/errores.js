// Un error que el usuario puede entender (libro inexistente, cupo lleno...).
// El servicio decide QUÉ pasó; la capa HTTP decide cómo responderlo.
class ErrorDeNegocio extends Error {
  constructor(mensaje, estado = 400) {
    super(mensaje)
    this.estado = estado
  }
}

module.exports = { ErrorDeNegocio }
