// /api/health: lo que verifica el pipeline después de cada despliegue.
const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { levantarApi } = require('./ayuda')

let api

before(async () => { api = await levantarApi() })
after(() => api.servidor.close())

test('GET /api/health responde ok con la versión y el entorno', async () => {
  const r = await fetch(`${api.base}/health`)
  assert.equal(r.status, 200)
  const salud = await r.json()
  assert.equal(salud.estado, 'ok')
  assert.equal(salud.version, 'test')
  assert.equal(salud.entorno, 'pruebas')
})
