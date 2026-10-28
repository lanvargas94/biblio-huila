const express = require('express')
const { DatabaseSync } = require('node:sqlite')

const app = express()
app.use(express.json())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

const db = new DatabaseSync('./biblio.db')
const ADMIN_KEY = 'biblio-admin-2026' // clave del bibliotecario

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
    var sql = 'SELECT * FROM libros'
    if (q) sql = sql + " WHERE titulo LIKE '%" + q + "%'"
    const r = db.prepare(sql).all()
    console.log('libros!!!', r)
    res.json(r)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message + ' ' + err.stack)
  }
})

app.post('/libros', function (req, res) {
  if (req.headers['x-admin-key'] != ADMIN_KEY) return res.status(401).send('no autorizado')
  try {
    const r = db.prepare("INSERT INTO libros (titulo, autor, ejemplares) VALUES ('" + req.body.titulo + "', '" + req.body.autor + "', " + req.body.ejemplares + ')').run()
    res.json({ id: r.lastInsertRowid })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message + ' ' + err.stack)
  }
})

app.listen(3000)
