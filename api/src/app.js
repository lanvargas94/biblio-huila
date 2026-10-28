// Arma la aplicación Express. No abre puertos ni bases: server.js la enciende
// y las pruebas la usan con una base en memoria.
const express = require('express')
const { rutasLibros } = require('./rutas/libros.rutas')
const { rutasPrestamos } = require('./rutas/prestamos.rutas')
const { requiereAdmin } = require('./middleware/requiere-admin')

function crearApp({ servicios, config }) {
  const app = express()
  app.use(express.json())
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  })

  app.use('/api/libros', rutasLibros(servicios.libros, requiereAdmin(config.claveAdmin)))
  app.use('/api/prestamos', rutasPrestamos(servicios.prestamos))
  return app
}

module.exports = { crearApp }
