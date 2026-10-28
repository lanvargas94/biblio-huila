// Capa HTTP de préstamos: traduce la petición a un caso de uso y el resultado a JSON.
// Los errores no se atrapan aquí: los recibe el manejador central (errores.js).
const express = require('express')

function rutasPrestamos(servicio) {
  const r = express.Router()
  r.get('/', (req, res) => res.json(servicio.listar()))
  r.get('/vencidos', (req, res) => res.json(servicio.vencidos()))
  r.post('/', (req, res) => res.status(201).json(servicio.prestar({ lector: req.body.lector, libroId: req.body.libroId })))
  r.put('/:id/devolver', (req, res) => res.json(servicio.devolver(req.params.id)))
  return r
}

module.exports = { rutasPrestamos }
