// Las reglas de la biblioteca, en un solo lugar y con nombre. Si cambia la política
// (por ejemplo, préstamos de 20 días), se cambia aquí y en ningún otro archivo.
const MAX_PRESTAMOS_POR_LECTOR = 3
const DIAS_DE_PRESTAMO = 15
const MULTA_POR_DIA = 1500 // pesos colombianos
const MS_POR_DIA = 24 * 60 * 60 * 1000

function calcularVencimiento(desde) {
  return new Date(desde.getTime() + DIAS_DE_PRESTAMO * MS_POR_DIA)
}

function diasDeRetraso(vence, hoy) {
  return Math.max(0, Math.floor((hoy.getTime() - new Date(vence).getTime()) / MS_POR_DIA))
}

function calcularMulta(vence, hoy) {
  return diasDeRetraso(vence, hoy) * MULTA_POR_DIA
}

module.exports = { MAX_PRESTAMOS_POR_LECTOR, DIAS_DE_PRESTAMO, MULTA_POR_DIA, calcularVencimiento, diasDeRetraso, calcularMulta }
