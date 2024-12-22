const fs = require('fs');
const path = require('path');
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
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
        fs.readFile(p, 'utf8', (err, data) => {
            let products = [];
            if (!err) {
                products = JSON.parse(data);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            })
        })
        return this;
    }

    static fetchAll(cb) {
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
        fs.readFile(p, 'utf8', (err, data) => {
            if (err) {
                cb([]);
            } else {
                cb(JSON.parse(data));
            }
        })
    }
}