// Solo el bibliotecario (cabecera x-admin-key) puede modificar el catálogo.
function requiereAdmin(claveAdmin) {
  return function (req, res, next) {
    if (req.get('x-admin-key') !== claveAdmin) return res.status(401).json({ error: 'no autorizado' })
    next()
  }
}

module.exports = { requiereAdmin }
