const API = 'http://localhost:3000'

async function cargar() {
  const libros = await (await fetch(API + '/libros')).json()
  document.getElementById('libros').innerHTML = libros.map(l =>
    `<tr><td>${l.id}</td><td>${l.titulo}</td><td>${l.autor}</td><td>${l.ejemplares}</td></tr>`).join('')
  document.getElementById('libro').innerHTML = libros.map(l => `<option value="${l.id}">${l.titulo}</option>`).join('')
  const prestamos = await (await fetch(API + '/prestamos')).json()
  document.getElementById('prestamos').innerHTML = prestamos.map(p =>
    `<tr><td>${p.id}</td><td>${p.titulo}</td><td>${p.lector}</td><td>${p.vence.slice(0, 10)}</td><td>${p.devuelto ? 'devuelto' : 'prestado'}</td></tr>`).join('')
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const r = await fetch(API + '/prestamos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lector: document.getElementById('lector').value, libroId: document.getElementById('libro').value })
  })
  document.getElementById('msg').textContent = r.ok ? 'Préstamo registrado' : await r.text()
  cargar()
})

cargar()
