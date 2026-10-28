# Front: archivos estáticos detrás de nginx. No hay nada que compilar, solo copiar.
FROM nginx:1.30-alpine
# Parches de seguridad del sistema operativo de la imagen base (Trivy los exige).
RUN apk upgrade --no-cache
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
