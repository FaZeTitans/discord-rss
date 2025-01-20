const Database = require('better-sqlite3');

// Initialisation de la base SQLite
const db = new Database('rss-discord.db');

// Création de la table pour les articles vus
db.prepare(
    `
  CREATE TABLE IF NOT EXISTS seen_items (
    id TEXT PRIMARY KEY
  )
`
).run();

// Vérifier si un article a déjà été vu
const hasBeenSeen = (id) => {
    const row = db.prepare('SELECT id FROM seen_items WHERE id = ?').get(id);
    return !!row;
};

// Marquer un article comme vu
const markAsSeen = (id) => {
    db.prepare('INSERT OR IGNORE INTO seen_items (id) VALUES (?)').run(id);
};

module.exports = { hasBeenSeen, markAsSeen };
