// Arma la aplicación Express. No abre puertos ni bases: server.js la enciende
// y las pruebas la usan con una base en memoria.
const express = require('express')
const { rutasLibros } = require('./rutas/libros.rutas')
const { rutasPrestamos } = require('./rutas/prestamos.rutas')
const { rutaSalud } = require('./rutas/salud.rutas')
const { requiereAdmin } = require('./middleware/requiere-admin')
const { registroDePeticiones } = require('./middleware/registro-peticiones')
const { rutaNoEncontrada, manejadorDeErrores } = require('./errores')

function crearApp({ servicios, config, log }) {
  const app = express()
  app.use(registroDePeticiones(log))
  app.use(express.json())
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  })

  app.get('/api/health', rutaSalud(servicios.salud, config))
  app.use('/api/libros', rutasLibros(servicios.libros, requiereAdmin(config.claveAdmin)))
  app.use('/api/prestamos', rutasPrestamos(servicios.prestamos))
  app.use('/api', rutaNoEncontrada)
  app.use(manejadorDeErrores(log))
  return app
}

module.exports = { crearApp }
