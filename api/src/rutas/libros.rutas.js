// Capa HTTP de libros: traduce la petición a un caso de uso y el resultado a JSON.
// Los errores no se atrapan aquí: los recibe el manejador central (errores.js).
const express = require('express')

function rutasLibros(servicio, soloAdmin) {
  const r = express.Router()
  r.get('/', (req, res) => res.json(servicio.listar(req.query.q)))
  r.post('/', soloAdmin, (req, res) => res.status(201).json(servicio.crear(req.body)))
  return r
}

module.exports = { rutasLibros }
