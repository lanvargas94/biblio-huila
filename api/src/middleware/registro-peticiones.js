// Una línea de log por petición: método, ruta, estado y cuánto tardó.
function registroDePeticiones(log) {
  return function (req, res, next) {
    const inicio = process.hrtime.bigint()
    res.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - inicio) / 1e6
      log.info('peticion', { metodo: req.method, ruta: req.originalUrl, estado: res.statusCode, ms: Math.round(ms) })
    })
    next()
  }
}

module.exports = { registroDePeticiones }
