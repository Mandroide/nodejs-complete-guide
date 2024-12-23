const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, 'utf8', (err, data) => {
            // Fetch the previous cart
            const cart = err ? {products: [], totalPrice: 0} : JSON.parse(data);

            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex((product) => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // Add new product/ increase quantity
            if (existingProduct) {
                updatedProduct = {...existingProductIndex};
                updatedProduct.qty++;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += productPrice
            fs.writeFile(p, JSON.stringify(cart), 'utf8', (err) => {
                console.log(err);
            })

        })
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const updatedCart = {...JSON.parse(data)};
                const product = updatedCart.products.find(product => product.id === id);
                if (product) {
                    const productQty = product.qty;
                    updatedCart.products = updatedCart.products.filter(product => product.id !== id);
                    updatedCart.totalPrice -= productPrice * productQty;
                    fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                        console.log(err);
                    })
                }
            }
        })
    }

    static getCart(cb) {
        fs.readFile(p, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                cb(null);
            } else {
                const cart = JSON.parse(data);
                cb(cart);
            }
        });
    }
}