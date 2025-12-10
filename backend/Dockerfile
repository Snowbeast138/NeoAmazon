# backend/Dockerfile

# Usamos una imagen ligera de Node
FROM node:18-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json primero
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Exponemos el puerto en el que corre la app
EXPOSE 5000

# Comando para iniciar la aplicación (modo desarrollo)
# Para producción, usarías: CMD ["node", "src/index.js"]
CMD ["npm", "run", "dev"]