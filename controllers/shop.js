const Product = require("../models/Product");

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
    req.user.getCart()
        .then(cart => cart.getProducts())
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
    const productId = +req.body.id;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return fetchedCart.getProducts({where: {id: productId}})
        })
        .then(products => {
            if (products.length) {
                const product = products[0];
                newQuantity = product.cartItem.quantity + 1;
                return product;
            } else {
                return Product.findByPk(productId);
            }

        }).then(product => fetchedCart.addProduct(product, {
        through: {
            quantity: newQuantity,
            unitPrice: product.price
        }
    }))
        .then(() => res.redirect('/cart'))
        .catch((err) => {
            console.log(err);
        });
}

exports.postCartDelete = (req, res) => {
    const productId = +req.body.id;
    let fetchedCart;
    req.user.getCart().then((cart) => {
        fetchedCart = cart;
        return fetchedCart.getProducts({where: {id: productId}})
    }).then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    }).then(() => {
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    });
}

exports.postOrder = (req, res) => {
    req.user.getCart()
        .then((cart) => cart.getProducts())
        .then(products =>
            req.user.createOrder(products)
                .then(order => order.addProducts(products.map(product => {
                    product.orderItem = {quantity: product.cartItem.quantity, unitPrice: product.cartItem.unitPrice};
                    return product;
                })))
                .catch(err => console.log(err)))
        .then(() => res.redirect('/orders'))
        .catch((err) => {
            console.log(err);
        })
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