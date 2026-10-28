// Toda la configuración sale del entorno (12-factor): el mismo código corre en la
// laptop, en el pipeline y en la EC2; lo único que cambia son las variables.
const path = require('node:path')

function leerConfig(env = process.env) {
  if (!env.ADMIN_KEY) throw new Error('Falta la variable ADMIN_KEY (copie .env.example como .env)')
  return {
    puerto: Number(env.PORT) || 3000,
    rutaDb: env.RUTA_DB || path.join(__dirname, '..', 'datos', 'biblio.db'),
    claveAdmin: env.ADMIN_KEY,
  }
}

module.exports = { leerConfig }
