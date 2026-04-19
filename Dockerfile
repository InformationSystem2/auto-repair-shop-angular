# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Copy application code
COPY . .

# Build for production
RUN npm run build -- --configuration production

# Runtime stage
FROM nginx:stable-alpine

# Copy built Angular application to nginx
COPY --from=build /app/dist/auto-repair-shop-angular/browser /usr/share/nginx/html

# nginx.conf.template usa $BACKEND_URL — se sustituye en runtime con envsubst
# nginx.conf fijo sirve para docker-compose local (usa nombre de servicio)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

RUN chown -R nginx:nginx /usr/share/nginx/html

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

# Si BACKEND_URL está definida (Railway/producción), usa el template; si no, usa nginx.conf fijo (docker-compose local)
CMD ["sh", "-c", "if [ -n \"$BACKEND_URL\" ]; then envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf; fi && nginx -g 'daemon off;'"]
