const Product = require("../models/Product");

exports.getProducts = (req, res) => {
    Product.fetchAll().then((products) => {
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
    Product.findByPk(prodId).then((product) => {
        console.log(product);
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });

}

exports.getIndex = (req, res) => {
    Product.fetchAll().then((products) => {
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
    req.user.getCart()
        .then((products) => res.render('shop/cart',
            {
                pageTitle: 'Cart',
                path: '/cart',
                products: products
            })).catch((err) => {
        console.log(err);
    });
}

exports.postCart = (req, res) => {
    const productId = req.body.id;
    Product.findByPk(productId).then((product) => {
        req.user.addToCart(product);
        res.redirect('/cart')
    }).catch((err) => {
        console.log(err);
    });
}

exports.postCartDelete = (req, res) => {
    const productId = req.body.id;
    req.user.deleteItemFromCart(productId).then(() => {
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    });
}

exports.postOrder = (req, res) => {
    req.user.addOrder()
        .then(() => res.redirect('/orders'))
        .catch((err) => {
            console.log(err);
        })
}

exports.getOrders = (req, res) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err))

};