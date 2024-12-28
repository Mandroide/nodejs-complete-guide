const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        cart: {
            items: [{
                productId: {type: mongoose.Types.ObjectId, ref: 'Product', required: true},
                quantity: {type: Number, required: true}
            }],
        },
        orders: {
            items: [{
                product: {}
            }]
        }
    }
);
userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => cp.id.toString() === product._id.toString());

    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        updatedCartItems[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1;
    } else {
        updatedCartItems.push({productId: product._id, quantity: 1});
    }
    this.cart = {
        items: updatedCartItems
    };
    return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items.filter(cp => cp.id.toString() !== productId.toString());
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {items: []};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);