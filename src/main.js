const RSSParser = require('rss-parser');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { hasBeenSeen, markAsSeen } = require('./db');

const parser = new RSSParser();
const discordWebhookUrl = process.env.DISCORD_WEBHOOK;
const pollInterval = parseInt(process.env.POLL_INTERVAL, 10) || 60000;
let rateLimitDelay = 250; // Délai entre les requêtes
let messageQueue = [];
let isProcessingQueue = false;

// Charger les flux depuis feeds.json
const fetchFeeds = () => {
    try {
        const data = fs.readFileSync('./feeds.json', 'utf8');
        const parsed = JSON.parse(data);
        return parsed.feeds || [];
    } catch (err) {
        console.error('Erreur lors de la lecture de feeds.json:', err);
        return [];
    }
};

// Ajouter un message à la file d'attente
const enqueueMessage = (message) => {
    messageQueue.push(message);
    processQueue();
};

// Envoyer les messages un par un avec gestion du rate limit
const processQueue = async () => {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (messageQueue.length > 0) {
        const { feedName, title, link } = messageQueue.shift();

        // Format du message avec mention du flux
        const payload = { content: `**[${feedName}] ${title}**\n${link}` };

        try {
            await axios.post(discordWebhookUrl, payload);
            console.log(`New : ${feedName} - ${title}`);
            await new Promise((resolve) => setTimeout(resolve, rateLimitDelay));
        } catch (err) {
            if (err.response?.status === 429) {
                const retryAfter =
                    parseInt(err.response.headers['retry-after'], 10) || 1000;
                console.log(
                    `Rate limit atteint. Réessai dans ${retryAfter}ms...`
                );
                rateLimitDelay = retryAfter;
                messageQueue.unshift({ feedName, title, link }); // Réinsérer dans la file
                await new Promise((resolve) => setTimeout(resolve, retryAfter));
            } else {
                console.error(
                    'Erreur lors de l’envoi du message:',
                    err.response?.data || err.message
                );
            }
        }
    }

    isProcessingQueue = false;
};

// Récupérer et publier les nouvelles des flux
const fetchAndPostNews = async () => {
    const feeds = fetchFeeds();
    for (const { name: feedName, url } of feeds) {
        try {
            const feed = await parser.parseURL(url);

            for (const item of feed.items) {
                if (!hasBeenSeen(item.link)) {
                    markAsSeen(item.link);

                    const message = {
                        feedName,
                        title: item.title,
                        link: item.link,
                    };
                    enqueueMessage(message);
                }
            }
        } catch (err) {
            console.error(
                `Erreur lors de la récupération des flux de ${url}:`,
                err
            );
        }
    }
};

// Lancer la récupération des flux à intervalles réguliers
setInterval(fetchAndPostNews, pollInterval);
