// Pruebas de punta a punta por HTTP: la app real en un puerto libre.
const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { CONFIG, levantarApi } = require('./ayuda')

let api

before(async () => { api = await levantarApi() })
after(() => api.servidor.close())

test('GET /api/libros trae el catálogo semilla', async () => {
  const libros = await (await fetch(`${api.base}/libros`)).json()
  assert.equal(libros.length, 4)
})

test('la búsqueda con comilla no rompe la consulta', async () => {
  const r = await fetch(`${api.base}/libros?q=${encodeURIComponent("x'")}`)
  assert.equal(r.status, 200)
  assert.deepEqual(await r.json(), [])
})

test('POST /api/libros sin la clave del bibliotecario responde 401', async () => {
  const r = await api.enviar('POST', '/libros', { titulo: 'Nuevo', autor: 'Autor', ejemplares: 1 })
  assert.equal(r.status, 401)
})

test('POST /api/libros con la clave crea el libro', async () => {
  const r = await api.enviar('POST', '/libros', { titulo: 'Nuevo', autor: 'Autor', ejemplares: 1 },
    { 'x-admin-key': CONFIG.claveAdmin })
  assert.equal(r.status, 201)
  assert.ok((await r.json()).id > 4)
})

test('POST /api/prestamos registra el préstamo', async () => {
  const r = await api.enviar('POST', '/prestamos', { lector: 'Ana', libroId: 2 })
  assert.equal(r.status, 201)
  const prestamos = await (await fetch(`${api.base}/prestamos`)).json()
  assert.equal(prestamos[0].lector, 'Ana')
})

test('prestar un libro sin ejemplares responde 409 con el motivo en JSON', async () => {
  await api.enviar('POST', '/prestamos', { lector: 'Ana', libroId: 3 })
  const r = await api.enviar('POST', '/prestamos', { lector: 'Luis', libroId: 3 })
  assert.equal(r.status, 409)
  assert.equal((await r.json()).error, 'no hay ejemplares disponibles')
})

test('la API no abre CORS a cualquier origen', async () => {
  const r = await fetch(`${api.base}/libros`, { headers: { Origin: 'https://sitio-ajeno.example' } })
  assert.equal(r.headers.get('access-control-allow-origin'), null)
})
