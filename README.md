# RSS to Discord

## Description

**RSS to Discord** est un projet automatisé permettant de surveiller des flux RSS et de publier des mises à jour sous forme de messages sur un webhook Discord. Chaque flux est identifié par son nom pour faciliter l'organisation et la lecture des notifications.

Ce projet est conçu pour être facilement déployé en tant que conteneur Docker et est entièrement automatisé à l'aide de GitHub Actions.

---

## Fonctionnalités

- **Surveillance automatique** de plusieurs flux RSS définis dans un fichier de configuration.
- **Publication sur Discord** via un unique webhook, avec le titre et l'URL de chaque article.
- **Nom du flux inclus** dans chaque message pour une identification rapide.
- **Conteneurisation Docker** pour un déploiement rapide et simple.
- **Workflow GitHub Actions** pour la construction et la publication d'images Docker sur Docker Hub.

---

## Prérequis

- **Node.js** : Version 18 ou supérieure (pour exécutions locales).
- **Docker** : Pour exécuter le projet en conteneur.
- **GitHub Actions** : Pour l'automatisation des builds Docker (optionnel).

---

## Installation

### 1. Cloner le dépôt
```
git clone https://github.com/fazetitans/rss-to-discord.git
cd rss-to-discord
```

### 2. Installer les dépendances (exécution locale uniquement)
```
npm install
```

### 3. Configuration
Ajoutez un fichier `.env` à la racine du projet pour les variables sensibles :
```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
POLL_INTERVAL=60000
```

Ajoutez également un fichier `feeds.json` avec vos flux RSS :
```
{
  "feeds": [
    {
      "name": "Reddit - Funny",
      "url": "https://www.reddit.com/r/funny/.rss"
    },
    {
      "name": "Hacker News",
      "url": "https://news.ycombinator.com/rss"
    }
  ]
}
```

---

## Utilisation

### Exécuter localement
Pour exécuter le script manuellement :
```
node src/index.js
```

---

## Docker

### Construction de l'image Docker
```
docker build -t rss-to-discord .
```

### Exécution du conteneur
```
docker run -d \
  --name rss-to-discord \
  -v $(pwd)/feeds.json:/app/feeds.json \
  -v $(pwd)/rss-discord.db:/app/rss-discord.db \
  -e DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..." \
  rss-to-discord
```

---

## Automatisation avec GitHub Actions

Ce projet inclut un workflow GitHub Actions pour automatiser la construction et la publication d'images Docker.

### 1. Configuration des Secrets GitHub
Ajoutez les variables suivantes dans **Settings > Secrets and variables > Actions** :
- `DOCKER_USERNAME` : Votre nom d'utilisateur Docker Hub.
- `DOCKER_PASSWORD` : Le token généré sur Docker Hub.

### 2. Workflow de publication
Chaque fois qu'un nouveau **tag** est poussé au format `vMAJOR.MINOR.PATCH`, GitHub Actions :
- Construit une nouvelle image Docker.
- Publie l'image sur Docker Hub avec les tags `latest` et `vMAJOR.MINOR.PATCH`.

---

## Contribuer

1. Forkez ce dépôt.
2. Créez une branche pour vos modifications.
3. Envoyez un pull request avec une description détaillée.

---

## Licence

Ce projet est sous licence **MIT**. Consultez le fichier [debut simple]LICENSE[fin simple] pour plus d'informations.

---

## Auteurs

- **Axel DA SILVA (FaZeTitans)** - Développeur principal
- Contact : [contact@fazetitans.fr](mailto:contact@fazetitans.fr)

---

## Aperçu des Notifications Discord

Les notifications envoyées au webhook Discord incluent :
- **Nom du flux** pour une identification rapide.
- **Titre de l'article**.
- **Lien cliquable vers l'article**.

Exemple :
```
**[Reddit - Funny] The water is too deep, so he improvises**
https://www.reddit.com/r/funny/comments/3skxqc/the_water_is_too_deep_so_he_improvises/
```

---

## Exemple d'Image Docker

Pour télécharger l'image Docker publiée :
```
docker pull fazetitans/rss-to-discord:latest
```