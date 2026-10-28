// GET /api/health: lo consultan el HEALTHCHECK de Docker, el pipeline después de
// desplegar (compara la versión con el commit) y cualquier persona con un curl.
function rutaSalud(servicio, { version, entorno }) {
  return function (req, res) {
    const ok = servicio.baseResponde()
    res.status(ok ? 200 : 503).json({ estado: ok ? 'ok' : 'sin base', version, entorno, hora: new Date().toISOString() })
  }
}

module.exports = { rutaSalud }
