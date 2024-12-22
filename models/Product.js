const fs = require('fs');
const path = require('path');
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
    constructor(title) {
        this._title = title;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            })
        });
        return this;
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}