// ¿La API puede atender? Responde si la base contesta una consulta mínima.
function crearServicioSalud(db) {
  return {
    baseResponde() {
      try {
        db.prepare('SELECT 1').get()
        return true
      } catch {
        return false
      }
    },
  }
}

module.exports = { crearServicioSalud }
