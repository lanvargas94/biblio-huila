// Logs de una línea en JSON a la salida estándar: Docker los recoge
// (docker compose logs api) y CloudWatch los puede filtrar por campo.
function crearLog(salida = console) {
  function escribir(nivel, mensaje, datos = {}) {
    const linea = JSON.stringify({ hora: new Date().toISOString(), nivel, mensaje, ...datos })
    if (nivel === 'error') salida.error(linea)
    else salida.log(linea)
  }
  return {
    info: (mensaje, datos) => escribir('info', mensaje, datos),
    error: (mensaje, datos) => escribir('error', mensaje, datos),
  }
}

// Para las pruebas: no imprime nada.
const logSilencioso = crearLog({ log() {}, error() {} })

module.exports = { crearLog, logSilencioso }
