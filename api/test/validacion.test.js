// Lo que llega mal se rechaza con 400 y la lista de TODOS los problemas.
const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { CONFIG, levantarApi } = require('./ayuda')

let api

before(async () => { api = await levantarApi() })
after(() => api.servidor.close())

test('un préstamo sin datos responde 400 con un error por campo', async () => {
  const r = await api.enviar('POST', '/prestamos', {})
  assert.equal(r.status, 400)
  const { errores } = await r.json()
  assert.equal(errores.length, 2)
  assert.match(errores[0], /^lector/)
  assert.match(errores[1], /^libroId/)
})

test('un lector de solo espacios no es válido', async () => {
  const r = await api.enviar('POST', '/prestamos', { lector: '   ', libroId: 1 })
  assert.equal(r.status, 400)
})

test('ejemplares debe ser un entero positivo', async () => {
  const r = await api.enviar('POST', '/libros', { titulo: 'Nuevo', autor: 'Autor', ejemplares: 'muchos' },
    { 'x-admin-key': CONFIG.claveAdmin })
  assert.equal(r.status, 400)
  assert.deepEqual((await r.json()).errores, ['ejemplares: entero entre 1 y 50'])
})

test('devolver con un id que no es número responde 400', async () => {
  const r = await api.enviar('PUT', '/prestamos/abc/devolver')
  assert.equal(r.status, 400)
})

test('el lector se guarda sin espacios sobrantes', async () => {
  const r = await api.enviar('POST', '/prestamos', { lector: '  Marta  ', libroId: '4' })
  assert.equal(r.status, 201)
  assert.equal((await r.json()).lector, 'Marta')
})
