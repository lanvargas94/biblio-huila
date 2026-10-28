// Pruebas de las reglas de préstamo, sin HTTP: el servicio con una base en memoria.
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { abrir } = require('../src/db')
const { crearServicios } = require('../src/servicios')
const { crearReloj } = require('./ayuda')

function preparar() {
  const reloj = crearReloj('2026-10-01T12:00:00Z')
  const { prestamos } = crearServicios(abrir(':memory:'), { ahora: reloj.ahora })
  return { prestamos, reloj }
}

test('un préstamo vence 15 días después', () => {
  const { prestamos } = preparar()
  const { vence } = prestamos.prestar({ lector: 'Ana', libroId: 1 })
  assert.equal(new Date(vence).toISOString(), '2026-10-16T12:00:00.000Z')
})

test('no presta un libro sin ejemplares disponibles', () => {
  const { prestamos } = preparar()
  prestamos.prestar({ lector: 'Ana', libroId: 3 }) // «María» tiene 1 ejemplar
  assert.throws(() => prestamos.prestar({ lector: 'Luis', libroId: 3 }), /no hay ejemplares/)
})

test('un lector no puede tener más de 3 libros a la vez', () => {
  const { prestamos } = preparar()
  for (const libroId of [1, 2, 4]) prestamos.prestar({ lector: 'Ana', libroId })
  assert.throws(() => prestamos.prestar({ lector: 'Ana', libroId: 2 }), /3 libros/)
})

test('devolver 2 días tarde cobra 2 días de multa', () => {
  const { prestamos, reloj } = preparar()
  const { id } = prestamos.prestar({ lector: 'Ana', libroId: 1 })
  reloj.avanzarDias(17)
  assert.equal(prestamos.devolver(id).multa, 3000)
})

test('devolver a tiempo no cobra multa', () => {
  const { prestamos, reloj } = preparar()
  const { id } = prestamos.prestar({ lector: 'Ana', libroId: 1 })
  reloj.avanzarDias(10)
  assert.equal(prestamos.devolver(id).multa, 0)
})
