const products = []
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
        products.push(this)
        return this;
    }

    static fetchAll() {
        return products;
    }
}