FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY *.html config.js /usr/share/nginx/html/
COPY docker/40-write-config.sh /docker-entrypoint.d/40-write-config.sh
RUN chmod +x /docker-entrypoint.d/40-write-config.sh
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
