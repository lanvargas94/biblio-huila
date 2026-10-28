// Capa HTTP de libros: traduce la petición a un caso de uso y el resultado a JSON.
const express = require('express')

function rutasLibros(servicio, soloAdmin) {
  const r = express.Router()

  r.get('/', function (req, res) {
    try {
      const libros = servicio.listar(req.query.q)
      console.log('libros!!!', libros)
      res.json(libros)
    } catch (err) {
      console.log(err)
      res.status(500).send(err.message + ' ' + err.stack)
    }
  })

  r.post('/', soloAdmin, function (req, res) {
    try {
      res.json(servicio.crear(req.body))
    } catch (err) {
      console.log(err)
      res.status(500).send(err.message + ' ' + err.stack)
    }
  })

  return r
}

module.exports = { rutasLibros }
