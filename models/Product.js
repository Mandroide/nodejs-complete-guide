const {getDb} = require('../util/database')
const mongodb = require('mongodb');
module.exports = class Product {
    constructor(title, price, description, imageUrl, _id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = _id ? new mongodb.ObjectId(_id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        const collection = db.collection('products');
        return (this._id) ? collection.updateOne({_id: this._id}, {$set: this})
            : collection.insertOne(this);
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }

    static findByPk(id) {
        const db = getDb();
        return db.collection('products').findOne({_id: new mongodb.ObjectId(id)});
    }

    static deleteByPk(id) {
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)});
    }
}
