const connexionPromise = require('./connexion');
const sqlite3 = require('sqlite3').verbose();

let moment = require('moment');

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
        connexionPromise.then(db => {
            db.run('INSERT INTO messages (content) VALUES (?)', [content]);
        });

    }


    static all(cb) {

        // Connexion synchrone
        const db = new sqlite3.Database('./db/express.db');

        db.serialize(() => {

            db.all('SELECT * FROM messages ORDER BY created_at DESC', (err, rows) => {

                if (err) {
                    console.log("Erreur:", err);
                    cb([]);
                } else {
                    cb(rows.map(row => new Message(row)));
                }

                db.close();
            });
        });
    }



    static find(id, cb) {

        const db = new sqlite3.Database('./db/express.db');

        db.get('SELECT * FROM messages WHERE id = ?', [id], (err, row) => {
            db.close();

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
}

module.exports = Message;