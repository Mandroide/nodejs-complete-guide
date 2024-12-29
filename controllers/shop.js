const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getProducts = (req, res) => {
    Product.find().then((products) => {
        res.render('shop/product-list', {
            products: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch((err) => {
        console.log(err);
    });

}

exports.getProduct = (req, res) => {
    const prodId = req.params.productId
    Product.findById(prodId).then((product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });

}

exports.getIndex = (req, res) => {
    Product.find().then((products) => {
        res.render('shop/index', {
            products: products,
            pageTitle: 'Shop',
            path: '/'
        })
    }).catch((err) => {
        console.log(err);
    });
}

exports.getCart = (req, res) => {
    req.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then((user) => res.render('shop/cart',
            {
                pageTitle: 'Cart',
                path: '/cart',
                products: user.cart.items
            })).catch((err) => {
        console.log(err);
    });
}

exports.postCart = (req, res) => {
    const productId = req.body.id;
    Product.findById(productId)
        .then((product) => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
        .catch((err) => {
            console.log(err);
        });
}

exports.postCartDelete = (req, res) => {
    const productId = req.body.id;
    req.user.removeFromCart(productId).then(() => {
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    });
}

exports.postOrder = (req, res) => {
    req.user.populate('cart.items.productId')
        .then((user) => {
            const items = user.cart.items.map((item) => ({quantity: item.quantity, product: {...item.productId._doc}}));
            const order = new Order({
                user: {
                    userId: req.user,
                    email: req.user.email
                },
                items: items,
            });
            return order.save();
        })
        .then(() => req.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch((err) => {
            console.log(err);
        })
}

exports.getOrders = (req, res) => {
    Order.find({"user.userId": req.user._id})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err))

};