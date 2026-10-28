// Pruebas de las reglas puras: sin base, sin HTTP, instantáneas.
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { calcularVencimiento, diasDeRetraso, calcularMulta, MULTA_POR_DIA } = require('../src/servicios/reglas')

const HOY = new Date('2026-10-20T12:00:00Z')

test('el vencimiento es DIAS_DE_PRESTAMO después', () => {
  assert.equal(calcularVencimiento(new Date('2026-10-01T12:00:00Z')).toISOString(), '2026-10-16T12:00:00.000Z')
})

test('antes de vencer no hay días de retraso (nunca negativos)', () => {
  assert.equal(diasDeRetraso('2026-10-25T12:00:00Z', HOY), 0)
})

test('la multa es días de retraso por MULTA_POR_DIA', () => {
  assert.equal(calcularMulta('2026-10-16T12:00:00Z', HOY), 4 * MULTA_POR_DIA)
})
