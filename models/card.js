const sqlite3 = require('sqlite3').verbose();
const dbName = 'souk.sqlite';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
const sql = `
    CREATE TABLE IF NOT EXISTS card (
        id INTEGER primary key AUTOINCREMENT,
        userId INTEGER,
        productId INTEGER,
        numberUnits INTEGER
    )
    `;
    db.run(sql);
});

class Card {
    static all(cb) {
        db.all('SELECT * FROM card', cb);
    }

    static find(userId, productId, cb) {
        db.get('SELECT * FROM card WHERE userId = ? AND productId = ?', userId, productId, cb);
    }

    static createOrUpdate(data, cb) {
        console.log("createOrupdate");
        this.find(data.userId, data.productId, (err, product) => {
            let sql;
            if (product === undefined) {
                sql = 'INSERT INTO card(userId, productId, numberUnits) VALUES (?, ?, ?)';
                db.run(sql, data.userId, data.productId, 1, cb);
            }
            else {
                sql = 'UPDATE card SET numberUnits = ? WHERE id = ?';
                db.run(sql, product.numberUnits + 1, product.id, cb);
            }
        })
    }


    static allProductsMadeByAuser(userId, cb) {
        let sql = `SELECT c.userId, p.title, p.description, p.price, c.numberUnits FROM card c INNER JOIN products p ON p.id = c.productId Where c.userId = ?`;
        db.all(sql,userId, cb);
    }

    static delete(id, cb) {
        if (!id) return cb(new Error('Please provide an id'));
        db.run('DELETE FROM card WHERE id = ?', id, cb);
    }
}

module.exports.Card = Card;