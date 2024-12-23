const fs = require('fs');
const path = require('path');
const console = require("node:console");
const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
const getProductsFromFile = (cb) => {

    fs.readFile(p, 'utf8', (err, data) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(data));
        }
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            let value;
            if (this.id) {
                const existingProductIndex = products.findIndex(product => product.id === this.id)
                const updatedProducts = [...products]
                updatedProducts[existingProductIndex] = this;
                value = updatedProducts;
            } else {
                this.id = Math.trunc(Math.random() * Math.pow(10, 18));
                products.push(this);
                value = products;
            }
            fs.writeFile(p, JSON.stringify(value), (err) => {
                console.log(err);
            })
        });
        return this;
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find(product => product.id === id);
            cb(product);
        })
    }
}