# Utiliser une image officielle de Node.js
FROM node:23-slim

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Installer les dépendances système pour SQLite
RUN apk add --no-cache sqlite

# Copier le package.json et package-lock.json (s'ils existent)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer les logs en stdout
CMD ["node", "src/main.js"]

# Exemple pour documenter la variable d'environnement
ENV DISCORD_WEBHOOK="<Webhook Discord>"
ENV POLL_INTERVAL=60000

