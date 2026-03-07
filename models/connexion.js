const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const connexionPromise = open({
    filename: './db/express.db',
    driver: sqlite3.Database
});

connexionPromise.then((db) => {    
    return db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}).then(() => {

}).catch(err => {
    console.error('Erreur de connexion:', err.message);
});

module.exports = connexionPromise;