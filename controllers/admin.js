const Product = require('../models/Product');

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

exports.postAddProduct = (req, res) => {
    console.log(req.body);
    const product = new Product(req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res) => {
    Product.fetchAll((products) => {
        res.render('admin/product-list', {
            products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    })
}