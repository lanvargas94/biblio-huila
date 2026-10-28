// Arma la API completa con una base en memoria y un reloj que la prueba controla.
const { abrir } = require('../src/db')
const { crearServicios } = require('../src/servicios')
const { crearApp } = require('../src/app')
const { logSilencioso } = require('../src/log')

const CONFIG = { claveAdmin: 'clave-de-prueba' }

function crearReloj(fechaIso) {
  let actual = new Date(fechaIso)
  return {
    ahora: () => new Date(actual),
    avanzarDias(dias) { actual = new Date(actual.getTime() + dias * 24 * 60 * 60 * 1000) },
  }
}

async function levantarApi(reloj = crearReloj('2026-10-01T12:00:00Z')) {
  const servicios = crearServicios(abrir(':memory:'), { ahora: reloj.ahora })
  const servidor = crearApp({ servicios, config: CONFIG, log: logSilencioso }).listen(0)
  await new Promise((ok) => servidor.once('listening', ok))
  const base = `http://127.0.0.1:${servidor.address().port}/api`
  const enviar = (metodo, ruta, cuerpo, cabeceras = {}) => fetch(base + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...cabeceras },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  })
  return { servicios, servidor, base, enviar, reloj }
}

module.exports = { CONFIG, crearReloj, levantarApi }
