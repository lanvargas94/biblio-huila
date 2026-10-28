const express = require('express')
const fs = require('node:fs')
const path = require('node:path')
const { DatabaseSync } = require('node:sqlite')
const { leerConfig } = require('./config')

const config = leerConfig()

const app = express()
app.use(express.json())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

fs.mkdirSync(path.dirname(config.rutaDb), { recursive: true })
const db = new DatabaseSync(config.rutaDb)

db.exec(`CREATE TABLE IF NOT EXISTS libros (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, autor TEXT, ejemplares INTEGER);
CREATE TABLE IF NOT EXISTS prestamos (id INTEGER PRIMARY KEY AUTOINCREMENT, libro_id INTEGER, lector TEXT, fecha TEXT, vence TEXT, devuelto INTEGER, multa INTEGER)`)

// datos de prueba
var cuantos = db.prepare('SELECT COUNT(*) as n FROM libros').get()
if (cuantos.n == 0) {
  db.exec("INSERT INTO libros (titulo, autor, ejemplares) VALUES ('La vorágine', 'José Eustasio Rivera', 2), ('Cien años de soledad', 'Gabriel García Márquez', 3), ('María', 'Jorge Isaacs', 1), ('El olvido que seremos', 'Héctor Abad Faciolince', 2)")
}

app.get('/libros', function (req, res) {
  try {
    var q = req.query.q
    const r = q
      ? db.prepare('SELECT * FROM libros WHERE titulo LIKE ?').all('%' + q + '%')
      : db.prepare('SELECT * FROM libros').all()
    console.log('libros!!!', r)
    res.json(r)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message + ' ' + err.stack)
  }
})

app.post('/libros', function (req, res) {
  if (req.headers['x-admin-key'] !== config.claveAdmin) return res.status(401).send('no autorizado')
  try {
    const r = db.prepare('INSERT INTO libros (titulo, autor, ejemplares) VALUES (?, ?, ?)')
      .run(req.body.titulo, req.body.autor, req.body.ejemplares)
    res.json({ id: r.lastInsertRowid })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message + ' ' + err.stack)
  }
})

app.get('/prestamos', function (req, res) {
  try {
    const r = db.prepare('SELECT p.*, l.titulo FROM prestamos p JOIN libros l ON l.id = p.libro_id ORDER BY p.id DESC').all()
    res.json(r)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message + ' ' + err.stack)
  }
})

app.post('/prestamos', function (req, res) {
  try {
    const lector = req.body.lector
    const libro = db.prepare('SELECT * FROM libros WHERE id = ?').get(req.body.libroId)
    if (!libro) {
      res.status(404).send('no existe')
      return
    }
    const activos = db.prepare('SELECT COUNT(*) as n FROM prestamos WHERE lector = ? AND devuelto = 0').get(lector)
    if (activos.n >= 3) {
      res.status(400).send('el lector ya tiene 3 libros')
      return
    }
    const prestados = db.prepare('SELECT COUNT(*) as n FROM prestamos WHERE libro_id = ? AND devuelto = 0').get(libro.id)
    if (prestados.n >= libro.ejemplares) {
      res.status(400).send('no hay ejemplares')
      return
    }
    var hoy = new Date()
    var vence = new Date(hoy.getTime() + 15 * 24 * 60 * 60 * 1000)
    const r = db.prepare('INSERT INTO prestamos (libro_id, lector, fecha, vence, devuelto, multa) VALUES (?, ?, ?, ?, 0, 0)')
      .run(libro.id, lector, hoy.toISOString(), vence.toISOString())
    console.log('prestamo creado!!!', r)
    res.json({ id: r.lastInsertRowid, vence: vence })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message + ' ' + err.stack)
  }
})

app.put('/prestamos/:id/devolver', function (req, res) {
  try {
    const p = db.prepare('SELECT * FROM prestamos WHERE id = ?').get(req.params.id)
    if (!p) {
      res.status(404).send('no existe')
      return
    }
    var hoy = new Date()
    var dias = Math.floor((hoy.getTime() - new Date(p.vence).getTime()) / (24 * 60 * 60 * 1000))
    var multa = 0
    if (dias > 0) multa = dias * 1500
    db.prepare('UPDATE prestamos SET devuelto = 1, multa = ? WHERE id = ?').run(multa, p.id)
    res.json({ ok: true, multa: multa })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message + ' ' + err.stack)
  }
})

app.get('/prestamos/vencidos', function (req, res) {
  try {
    const todos = db.prepare('SELECT p.*, l.titulo FROM prestamos p JOIN libros l ON l.id = p.libro_id WHERE devuelto = 0').all()
    var vencidos = []
    for (var i = 0; i < todos.length; i++) {
      var hoy = new Date()
      var dias = Math.floor((hoy.getTime() - new Date(todos[i].vence).getTime()) / (24 * 60 * 60 * 1000))
      if (dias > 0) {
        todos[i].multa = dias * 1500
        vencidos.push(todos[i])
      }
    }
    res.json(vencidos)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message + ' ' + err.stack)
  }
})

app.listen(config.puerto, function () {
  console.log('servidor corriendo en el puerto ' + config.puerto)
})
