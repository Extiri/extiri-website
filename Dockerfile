FROM caddy:alpine

WORKDIR /srv/extiri

COPY Caddyfile ./
COPY . .

RUN rm Dockerfile
RUN rm Caddyfile
RUN rm -rf .git*
RUN rm -rf .venv

EXPOSE 80

CMD caddy run --config /srv/extiri/Caddyfile
