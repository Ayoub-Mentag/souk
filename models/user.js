const sqlite3 = require('sqlite3').verbose();
const dbName = 'souk.sqlite';
const db = new sqlite3.Database(dbName);
const { SECRET_ACCESS_TOKEN } = require('../config/getEnv.js');
const jwt = require('jsonwebtoken');

db.serialize(() => {
    console.log("Hello serialize\n");
    let sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER primary key AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
        `;
    db.run(sql);
});

class User {
    static all(cb) {
        db.all('SELECT * FROM users', cb);
    }

    static update(data, cb) {
        const sql = 'UPDATE users SET username = ?, password = ? WHERE id = ?;';
        db.get(sql, data.username, data.password, data.id, cb);
    }

    static getUserById(id, cb) {
        db.get('SELECT * FROM users WHERE id = ?', id, cb);
    }

    static find(user, cb) {
        db.get('SELECT * FROM users WHERE username = ? AND password = ?', user.username, user.password, cb);
    }
    
    static findByName(name, cb) {
        db.get('SELECT * FROM users WHERE username = ?', name, cb);
    }
    static create(data, cb) {
        const sql = 'INSERT INTO users(username, password) VALUES (?, ?)';
        db.run(sql, data.username, data.password, cb);
    }

    static delete(id, cb) {
        if (!id) return cb(new Error('Please provide an id'));
        db.run('DELETE FROM users WHERE id = ?', id, cb);
    }

    static deleteByName(name, cb) {
        db.run('DELETE FROM users WHERE username = ?', name, cb);
    }

    static generateAccessJWT(id) {
        let payload = {
            id
        };
        return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
            expiresIn: '20m'
        });
    };

}

module.exports.User = User;