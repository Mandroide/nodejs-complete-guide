const Product = require('../models/Product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res) => {
    const product = new Product(null, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    product.save();
    res.redirect('/');
}

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit === "true";
    if (!editMode) {
        res.redirect('/');
    } else {
        const productId = +req.params.productId;
        Product.findById(productId, (product) => {
            if (!product) {
                res.redirect('/');
            } else {
                res.render('admin/edit-product', {
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    product: product,
                    editing: editMode
                });
            }
        });
    }
};

exports.postEditProduct = (req, res) => {
    const product = new Product(+req.body.id, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    product.save();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res) => {
    Product.fetchAll((products) => {
        res.render('admin/product-list', {
            products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    })
}