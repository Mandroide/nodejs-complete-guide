const Cart = require('./Cart');
const db = require('../util/database');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return this.id ? db.query("UPDATE products SET title = ?, imageUrl = ?, description = ?, price = ? WHERE id = ?",
                [this.title, this.imageUrl, this.description, this.price, this.id]) :
            db.query("INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?)",
                [this.title, this.imageUrl, this.description, this.price])
    }

    static deleteById(id) {
        return db.query("UPDATE products SET isActive = ? WHERE id = ?",
            [false, id]);
    }

    static fetchAll() {
        return db.query("SELECT * FROM products LIMIT 100 WHERE isActive");
    }

    static findById(id) {
        return db.query("SELECT * FROM products WHERE isActive AND id = $1", [id],);
    }
}