const sqlite3 = require('sqlite3').verbose();
const dbName = 'souk.sqlite';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
const sql = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER primary key AUTOINCREMENT,
        title TEXT,
        description TEXT,
        price INTEGER,
        imgurl TEXT
    )
    `;
    db.run(sql);
});

class Product {
    static all(cb) {
        db.all('SELECT * FROM products', cb);
    }

    static update(data, cb) {
        const sql = 'UPDATE products SET title = ?, description = ? , price = ?, imgurl = ?  WHERE id = ?;';
        db.get(sql, data.title, data.description, data.price, data.imgurl, data.id, cb);
    }

    static find(id, cb) {
        db.get('SELECT * FROM products WHERE id = ?', id, cb);
    }

    static create(data, cb) {
        const sql = 'INSERT INTO products(title, description, price, imgurl) VALUES (?, ?, ?, ?)';
        db.run(sql, data.title, data.description, data.price, data.imgurl, cb);
    }


    static delete(id, cb) {
        if (!id) return cb(new Error('Please provide an id'));
        db.run('DELETE FROM products WHERE id = ?', id, cb);
    }
}

module.exports.Product = Product;