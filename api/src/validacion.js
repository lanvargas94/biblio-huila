// Valida lo que llega del cliente ANTES de llegar al servicio: devuelve los datos
// limpios o lanza un ErrorDeValidacion con TODOS los problemas a la vez.
const { ErrorDeNegocio } = require('./errores')

class ErrorDeValidacion extends ErrorDeNegocio {
  constructor(errores) {
    super('datos inválidos', 400)
    this.errores = errores
  }
}

function texto(valor, campo, maximo, errores) {
  const limpio = typeof valor === 'string' ? valor.trim() : ''
  if (!limpio || limpio.length > maximo) errores.push(`${campo}: obligatorio, máximo ${maximo} caracteres`)
  return limpio
}

function entero(valor, campo, minimo, maximo, errores) {
  const numero = Number(valor)
  if (valor === '' || valor === null || !Number.isInteger(numero) || numero < minimo || numero > maximo) {
    errores.push(`${campo}: entero entre ${minimo} y ${maximo}`)
  }
  return numero
}

function validar(armar) {
  const errores = []
  const datos = armar(errores)
  if (errores.length) throw new ErrorDeValidacion(errores)
  return datos
}

const validarLibro = (cuerpo = {}) => validar((e) => ({
  titulo: texto(cuerpo.titulo, 'titulo', 120, e),
  autor: texto(cuerpo.autor, 'autor', 80, e),
  ejemplares: entero(cuerpo.ejemplares, 'ejemplares', 1, 50, e),
}))

const validarPrestamo = (cuerpo = {}) => validar((e) => ({
  lector: texto(cuerpo.lector, 'lector', 60, e),
  libroId: entero(cuerpo.libroId, 'libroId', 1, Number.MAX_SAFE_INTEGER, e),
}))

const validarId = (valor) => validar((e) => entero(valor, 'id', 1, Number.MAX_SAFE_INTEGER, e))

function validarBusqueda(valor) {
  if (valor === undefined) return undefined
  return validar((e) => {
    if (typeof valor !== 'string' || valor.length > 60) e.push('q: texto de máximo 60 caracteres')
    return String(valor).trim()
  })
}

module.exports = { ErrorDeValidacion, validarLibro, validarPrestamo, validarId, validarBusqueda }
