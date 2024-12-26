const {getDb} = require('../util/database');
const mongodb = require('mongodb');

module.exports = class User {
    constructor(name, email, cart, _id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = _id;
    }

    save() {
        const db = getDb().collection('users');
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => cp.id.toString() === product._id.toString());

        const updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            updatedCartItems[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1;
        } else {
            updatedCartItems.push({id: new mongodb.ObjectId(product._id), quantity: 1});
        }
        const updatedCart = {
            items: updatedCartItems
        }
        const collection = getDb().collection('users');
        collection.updateOne({_id: this._id}, {$set: {cart: updatedCart}});
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => item.id.toString() !== productId.toString());
        return getDb().collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: {items: updatedCartItems}}});
    }

    getCart() {
        const productIds = this.cart.items.map(cp => cp.id);
        return getDb().collection('users').find({_id: {$in: productIds}}).toArray()
            .then(products => products.map(product => ({
                ...product,
                quantity: this.cart.items.find(c => c.id.toString() === product._id.toString()).quantity
            })));
    }

    addOrder() {
        const db = getDb();
        return this.getCart().then((products) => {
            const order = {
                items: products, user: {
                    _id: new mongodb.ObjectId(this._id),
                    name: this.name
                }
            };
            return db.collection('orders').insertOne(order)
        }).then(() => {
            this.cart = {items: []};
            return db.collection('users').updateOne({_id: this._id}, {$set: {cart: []}})
        })
    }

    getOrders() {
        return getDb().collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}).toArray()
    }

    static findByPk(id) {
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(id)});
    }
}