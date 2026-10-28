# Pipeline CI/CD

```mermaid
flowchart LR
    P["push / PR"] --> T["1 · Pruebas<br/>npm ci · npm test"]
    T -->|verde| B["2 · Imágenes<br/>docker build<br/>APP_VERSION=SHA"]
    B --> S{"Trivy<br/>¿CRITICAL<br/>con arreglo?"}
    S -->|sí| X["❌ falla el PR"]
    S -->|no| M{"¿push a main?"}
    M -->|no, es PR| OK["✅ checks verdes<br/>listo para revisar"]
    M -->|sí| G["publica en GHCR"]
    G --> D{"DESPLEGAR_EC2 = si"}
    D -->|sí| E["3 · SSH a la EC2<br/>compose pull + up --wait"]
    E --> V["4 · curl /api/health<br/>¿version == SHA?"]
```

En este repositorio el paso de seguridad **sí** detuvo un PR ([#13](../../pull/13)): la imagen
`nginx:1.27-alpine` traía **3 vulnerabilidades CRÍTICAS** con arreglo: `brotli-libs`
(CVE-2026-111497) y `libcrypto3`/`libssl3` de OpenSSL (CVE-2026-31789). Subir de versión no
bastaba (todas las etiquetas de nginx traían `brotli-libs` vulnerable), así que en la misma rama
se pasó a `nginx:1.30-alpine` con `RUN apk upgrade --no-cache` (parches del sistema operativo al
construir) y el pipeline quedó en verde.
