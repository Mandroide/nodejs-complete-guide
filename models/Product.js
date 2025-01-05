const mongoose = require('mongoose');
const User = require('../models/User');

const productSchema = mongoose.model('Product', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}));

productSchema.pre('deleteOne', function (next, req) {
    User.update({}, {
        $pull: {
            'cart.items': {
                product: this._conditions._id
            }
        }
    }, {
        multi: true
    })
        .then(() => {
            next();
        })
});

module.exports = productSchema;