// El front llama a la API por ruta RELATIVA: en la laptop la sirve la propia API y en
// Docker/EC2 nginx reenvía /api/ al contenedor api. Ningún localhost escrito a mano.
const API = '/api'

async function pedir(ruta, opciones) {
  const r = await fetch(API + ruta, opciones)
  const cuerpo = await r.json()
  if (!r.ok) throw new Error(cuerpo.errores ? cuerpo.errores.join(' · ') : cuerpo.error)
  return cuerpo
}

// Las celdas se llenan con textContent: un título como <img onerror=...> se muestra
// como texto y no se ejecuta (antes, con innerHTML, sí: XSS).
function fila(celdas) {
  const tr = document.createElement('tr')
  for (const celda of celdas) {
    const td = document.createElement('td')
    if (celda instanceof Node) td.append(celda)
    else td.textContent = celda
    tr.append(td)
  }
  return tr
}

function avisar(texto, esError = false) {
  const msg = document.getElementById('msg')
  msg.textContent = texto
  msg.className = esError ? 'error' : ''
}

function botonDevolver(id) {
  const boton = document.createElement('button')
  boton.textContent = 'Devolver'
  boton.addEventListener('click', async () => {
    try {
      const { multa } = await pedir(`/prestamos/${id}/devolver`, { method: 'PUT' })
      avisar(multa ? `Devuelto con multa de $${multa}` : 'Devuelto a tiempo')
    } catch (e) {
      avisar(e.message, true)
    }
    cargar()
  })
  return boton
}

async function cargar() {
  const libros = await pedir('/libros')
  document.getElementById('libros').replaceChildren(...libros.map((l) => fila([l.id, l.titulo, l.autor, l.ejemplares])))
  document.getElementById('libro').replaceChildren(...libros.map((l) => new Option(l.titulo, l.id)))
  const prestamos = await pedir('/prestamos')
  document.getElementById('prestamos').replaceChildren(...prestamos.map((p) => fila([
    p.id, p.titulo, p.lector, p.vence.slice(0, 10), p.devuelto ? `devuelto (multa $${p.multa})` : botonDevolver(p.id),
  ])))
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  try {
    const prestamo = await pedir('/prestamos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lector: document.getElementById('lector').value, libroId: document.getElementById('libro').value }),
    })
    avisar(`Préstamo registrado: vence el ${prestamo.vence.slice(0, 10)}`)
  } catch (err) {
    avisar(err.message, true)
  }
  cargar()
})

cargar().catch((e) => avisar('No se pudo conectar con la API: ' + e.message, true))
