const Product = require('../models/Product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res) => {
    const product = new Product(
        req.body.title,
        +req.body.price,
        req.body.description,
        req.body.imageUrl,
        null,
        req.user._id,
    );
    product.save().then(() => {
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
    })

}

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit === "true";
    if (!editMode) {
        res.redirect('/');
    } else {
        const productId = req.params.productId;
        Product.findByPk(productId).then(product => {
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
        }).catch(err => {
            console.log(err);
        });
    }
};

exports.postEditProduct = (req, res) => {
    const product = new Product(
        req.body.title,
        +req.body.price,
        req.body.description,
        req.body.imageUrl,
        req.body._id);

    product.save().then(() => {
        res.redirect('/admin/products')
    }).catch((err) => {
        console.log(err);
    });
};

exports.getProducts = (req, res) => {
    Product.fetchAll().then((products) => {
        res.render('admin/product-list', {
            products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch((err) => {
        console.log(err);
    });
}

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.id;
    Product.deleteByPk(productId)
        .then(() => res.redirect('/admin/products')).catch((err) => {
        console.log(err);
    });
};
