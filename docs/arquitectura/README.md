# Arquitectura de BiblioHuila

| # | Diagrama | Responde |
|---|---|---|
| 1 | [Contexto (C4 nivel 1)](01-contexto.md) | ¿Quién usa el sistema y con qué habla? |
| 2 | [Contenedores (C4 nivel 2)](02-contenedores.md) | ¿Qué procesos corren y cómo se comunican? |
| 3 | [Componentes de la API (C4 nivel 3)](03-componentes.md) | ¿Cómo está organizada la API por dentro? |
| 4 | [Despliegue](04-despliegue.md) | ¿Dónde corre cada contenedor en producción? |
| 5 | [Pipeline CI/CD](05-pipeline.md) | ¿Qué pasa desde un `git push` hasta producción? |

## Decisiones (ADR cortos)

**ADR-01 · Monolito modular en capas, no microservicios.** Un solo dominio (préstamos) y un
equipo pequeño: separar en capas (rutas → servicios → repositorios) da testabilidad sin el costo
de red, despliegue y datos distribuidos de los microservicios.

**ADR-02 · SQLite en un volumen.** Cabe en una t3.micro y no requiere otro contenedor. Si
crecieran los usuarios concurrentes, el repositorio es el único que cambia (PostgreSQL).

**ADR-03 · nginx como única puerta.** El front y la API quedan en el mismo origen (sin CORS) y
la API nunca se publica: solo nginx escucha en el puerto 80.

**ADR-04 · Imágenes inmutables por commit.** El pipeline construye una vez, etiqueta con el
SHA y la EC2 solo descarga (`compose.prod.yml` no tiene `build`). Volver atrás = desplegar el
TAG anterior.
