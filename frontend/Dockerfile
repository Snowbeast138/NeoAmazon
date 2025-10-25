# frontend/Dockerfile

# --- Etapa 1: Construcción (Build) ---
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos manifests y instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Construimos la app de producción
RUN npm run build

# --- Etapa 2: Servicio (Serve) ---
FROM nginx:alpine

# Copiamos los archivos estáticos construidos (de la Etapa 1) al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Opcional: Copiar una config de Nginx personalizada si necesitas reverse proxy
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Exponemos el puerto 80 (default de Nginx)
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]