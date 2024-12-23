const Product = require("../models/Product");
const Cart = require("../models/Cart");
exports.getProducts = (req, res) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            products: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });

}

exports.getProduct = (req, res) => {
    const prodId = +req.params.productId
    Product.findById(prodId, (product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    })

}

exports.getIndex = (req, res) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            products: products,
            pageTitle: 'Shop',
            path: '/'
        })
    })
}

exports.getCart = (req, res) => {
    Cart.getCart(cart => {
        Product.fetchAll((products) => {
            const cartProducts = [];
            for (const product of products) {
                const cartProductData = cart.products.find((prod) => prod.id === product.id);
                if (cart.products.find((prod) => prod.id === product.id)) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: cartProducts

            });
        })
    });
}

exports.postCart = (req, res) => {
    const productId = +req.body.id;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, +product.price)
        res.redirect('/cart');
    });
}

exports.postCartDelete = (req, res) => {
    const productId = +req.body.id;
    Product.findById(productId, (product) => {
        Cart.deleteProduct(productId, product.price)
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res) => {
    Product.fetchAll((products) => {
        res.render('shop/orders', {
            products: products,
            pageTitle: 'Your Orders',
            path: '/orders'
        })
    })
}

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}