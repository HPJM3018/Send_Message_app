const sqlite3 = require('sqlite3').verbose();
const path = require('path');
let moment = require('moment');

let dbPath;
if (process.env.NODE_ENV === 'test') {
    dbPath = path.join(__dirname, '../db/express_test.db');
} else {
    dbPath = path.join(__dirname, '../db/express.db');
}

console.log(`Base de données utilisée: ${dbPath}`);

if (process.env.NODE_ENV === 'test') {
    const fs = require('fs');
    if (fs.existsSync(dbPath)) {
        try {
            fs.unlinkSync(dbPath);
        } catch (e) {
        }
    }
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur de connexion:', err.message);
    } else {
        console.log('Connexion SQLite établie');
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

class Message {
    constructor(row) {
        this.row = row
    }

    get id() {
        return this.row.id
    }

    get content() {
        return this.row.content
    }

    get created_at() {
        moment.locale('fr');
        return moment(this.row.created_at)
    }

    static create(content) {
        db.run('INSERT INTO messages (content) VALUES (?)', [content], function (err) {
            if (err) {
                console.error(err);
            }
        });
    }

    static all(cb) {
        db.all('SELECT * FROM messages ORDER BY created_at DESC', (err, rows) => {
            if (err) {
                console.log(err);
                cb([]);
            } else {
                cb(rows.map(row => new Message(row)));
            }
        });
    }

    static find(id, cb) {
        db.get('SELECT * FROM messages WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.log(err.message);
                return cb(null);
            }
            if (row) {
                return cb(new Message(row));
            }
            return cb(null);
        });
    }

    static close(callback) {
        db.close((err) => {
            if (callback) callback(err);
        });
    }
}

module.exports = Message;