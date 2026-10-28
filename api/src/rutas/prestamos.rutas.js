// Capa HTTP de préstamos: valida la entrada, llama al caso de uso y responde JSON.
// Los errores no se atrapan aquí: los recibe el manejador central (errores.js).
const express = require('express')
const { validarPrestamo, validarId } = require('../validacion')

function rutasPrestamos(servicio) {
  const r = express.Router()
  r.get('/', (req, res) => res.json(servicio.listar()))
  r.get('/vencidos', (req, res) => res.json(servicio.vencidos()))
  r.post('/', (req, res) => res.status(201).json(servicio.prestar(validarPrestamo(req.body))))
  r.put('/:id/devolver', (req, res) => res.json(servicio.devolver(validarId(req.params.id))))
  return r
}

module.exports = { rutasPrestamos }
