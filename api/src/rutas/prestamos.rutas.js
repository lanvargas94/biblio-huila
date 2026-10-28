// Capa HTTP de préstamos: traduce la petición a un caso de uso y el resultado a JSON.
const express = require('express')

function rutasPrestamos(servicio) {
  const r = express.Router()

  r.get('/', function (req, res) {
    try {
      res.json(servicio.listar())
    } catch (err) {
      console.log(err)
      res.status(500).send(err.message + ' ' + err.stack)
    }
  })

  r.get('/vencidos', function (req, res) {
    try {
      res.json(servicio.vencidos())
    } catch (err) {
      console.log(err)
      res.status(500).send(err.message + ' ' + err.stack)
    }
  })

  r.post('/', function (req, res) {
    try {
      const prestamo = servicio.prestar({ lector: req.body.lector, libroId: req.body.libroId })
      console.log('prestamo creado!!!', prestamo)
      res.json(prestamo)
    } catch (err) {
      if (err.estado) return res.status(err.estado).send(err.message)
      console.log(err)
      res.status(500).send(err.message + ' ' + err.stack)
    }
  })

  r.put('/:id/devolver', function (req, res) {
    try {
      res.json(servicio.devolver(req.params.id))
    } catch (err) {
      if (err.estado) return res.status(err.estado).send(err.message)
      console.log(err)
      res.status(500).send(err.message + ' ' + err.stack)
    }
  })

  return r
}

module.exports = { rutasPrestamos }
