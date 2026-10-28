// El manejador central: respuestas JSON coherentes y sin filtrar detalles internos.
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { crearApp } = require('../src/app')
const { logSilencioso } = require('../src/log')
const { CONFIG } = require('./ayuda')

async function conServicios(servicios, prueba) {
  const servidor = crearApp({ servicios, config: CONFIG, log: logSilencioso }).listen(0)
  await new Promise((ok) => servidor.once('listening', ok))
  try {
    await prueba(`http://127.0.0.1:${servidor.address().port}/api`)
  } finally {
    servidor.close()
  }
}

const fallaLaBase = { libros: { listar() { throw new Error('SQLITE_BUSY en C:/ruta/interna/biblio.db') } }, prestamos: {} }

test('un error inesperado responde 500 sin mostrar el detalle', async () => {
  await conServicios(fallaLaBase, async (base) => {
    const r = await fetch(`${base}/libros`)
    assert.equal(r.status, 500)
    const texto = await r.text()
    assert.equal(texto, JSON.stringify({ error: 'error interno' }))
  })
})

test('una ruta de /api que no existe responde 404 en JSON', async () => {
  await conServicios(fallaLaBase, async (base) => {
    const r = await fetch(`${base}/no-existe`)
    assert.equal(r.status, 404)
    assert.equal((await r.json()).error, 'ruta no encontrada')
  })
})

test('un cuerpo que no es JSON responde 400', async () => {
  await conServicios(fallaLaBase, async (base) => {
    const r = await fetch(`${base}/prestamos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{ roto' })
    assert.equal(r.status, 400)
  })
})
