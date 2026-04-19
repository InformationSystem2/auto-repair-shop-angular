# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servidor Nginx para producción
FROM nginx:stable-alpine
# Copiamos el build de Angular a la ruta de Nginx
COPY --from=build /app/dist/auto-repair-shop-angular/browser /usr/share/nginx/html
# Copiamos la configuración de Nginx (SPA routing + proxy al backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Exponemos el puerto 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
