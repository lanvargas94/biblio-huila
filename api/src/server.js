// Punto de entrada: lee la configuración, abre la base y enciende la API.
const { leerConfig } = require('./config')
const { abrir } = require('./db')
const { crearServicios } = require('./servicios')
const { crearApp } = require('./app')
const { crearLog } = require('./log')

const log = crearLog()
const config = leerConfig()
const db = abrir(config.rutaDb)
const app = crearApp({ servicios: crearServicios(db), config, log })

const servidor = app.listen(config.puerto, () => {
  log.info('api escuchando', { puerto: config.puerto, version: config.version, entorno: config.entorno })
})

// Docker manda SIGTERM al detener o reemplazar el contenedor: se terminan las
// peticiones en curso y se cierra la base, en vez de cortar un préstamo a la mitad.
for (const senal of ['SIGTERM', 'SIGINT']) {
  process.on(senal, () => {
    log.info('apagando', { senal })
    servidor.close(() => {
      db.close()
      process.exit(0)
    })
  })
}
