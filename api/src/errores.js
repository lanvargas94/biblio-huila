// Errores de la aplicación y el ÚNICO lugar donde se convierten en respuesta HTTP.
// El servicio decide QUÉ pasó (ErrorDeNegocio); este manejador decide cómo se responde.

// Un error que el usuario puede entender (libro inexistente, cupo lleno...).
class ErrorDeNegocio extends Error {
  constructor(mensaje, estado = 400) {
    super(mensaje)
    this.estado = estado
  }
}

function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: 'ruta no encontrada' })
}

// Express reconoce el manejador de errores porque recibe 4 parámetros.
function manejadorDeErrores(log) {
  return function (err, req, res, next) {
    if (err instanceof ErrorDeNegocio) {
      return res.status(err.estado).json({ error: err.message, ...(err.errores && { errores: err.errores }) })
    }
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' })
    // Lo inesperado: el detalle va al log, NUNCA al cliente (no se filtran rutas ni SQL).
    log.error('error inesperado', { metodo: req.method, ruta: req.originalUrl, detalle: err.stack })
    res.status(500).json({ error: 'error interno' })
  }
}

module.exports = { ErrorDeNegocio, rutaNoEncontrada, manejadorDeErrores }
