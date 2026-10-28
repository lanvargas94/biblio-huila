// Capa HTTP de libros: valida la entrada, llama al caso de uso y responde JSON.
// Los errores no se atrapan aquí: los recibe el manejador central (errores.js).
const express = require('express')
const { validarLibro, validarBusqueda } = require('../validacion')

function rutasLibros(servicio, soloAdmin) {
  const r = express.Router()
  r.get('/', (req, res) => res.json(servicio.listar(validarBusqueda(req.query.q))))
  r.post('/', soloAdmin, (req, res) => res.status(201).json(servicio.crear(validarLibro(req.body))))
  return r
}

module.exports = { rutasLibros }
