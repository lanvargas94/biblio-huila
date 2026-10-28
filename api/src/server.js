// Punto de entrada: lee la configuración, abre la base y enciende la API.
const { leerConfig } = require('./config')
const { abrir } = require('./db')
const { crearServicios } = require('./servicios')
const { crearApp } = require('./app')

const config = leerConfig()
const db = abrir(config.rutaDb)
const app = crearApp({ servicios: crearServicios(db), config })

app.listen(config.puerto, function () {
  console.log('servidor corriendo en el puerto ' + config.puerto)
})
