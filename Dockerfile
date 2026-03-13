# Koristimo Node.js LTS image
FROM node:20

# Kreiramo folder unutar containera za app
WORKDIR /app

# Kopiramo package.json i package-lock.json da instaliramo dependencies
COPY package*.json ./

# Instaliramo sve npm dependencies
RUN npm install

# Kopiramo ostatak backend koda u container
COPY . .

# Expose port koji backend koristi (mora odgovarati .env PORT)
EXPOSE 5000

# Pokrećemo backend
CMD ["npm", "run", "dev"]