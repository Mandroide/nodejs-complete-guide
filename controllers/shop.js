const Product = require("../models/Product");
const Cart = require("../models/Cart");
exports.getProducts = (req, res) => {
    Product.findAll().then((products) => {
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
    const prodId = +req.params.productId
    Product.findByPk(prodId).then((product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });

}

exports.getIndex = (req, res) => {
    Product.findAll().then((products) => {
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
    Cart.getCart(cart => {
        Product.findAll().then((products) => {
            const cartProducts = [];
            for (const product of products) {
                const cartProductData = cart.products.find((prod) => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: cartProducts

            });
        }).catch((err) => {
            console.log(err);
        });
    });
}

exports.postCart = (req, res) => {
    const productId = +req.body.id;
    Product.findById(productId).then(({rows}) => {
        const row = rows[0];
        Cart.addProduct(productId, +row.price)
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    });
}

exports.postCartDelete = (req, res) => {
    const productId = +req.body.id;
    Product.findById(productId).then(({rows}) => {
        const row = rows[0];
        Cart.deleteProduct(productId, row.price)
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    });
}

exports.getOrders = (req, res) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}