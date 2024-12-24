const Product = require('../models/Product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res) => {
    req.user.createProduct({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: +req.body.price,
        description: req.body.description
    }).then(() => {
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
        const productId = +req.params.productId;
        Product.findByPk(productId).then((product) => {
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
    Product.findByPk(+req.body.id).then((product) => {
        product.title = req.body.title;
        product.imageUrl = req.body.imageUrl;
        product.price = +req.body.price;
        product.description = req.body.description;
        return product.save();
    }).then(() => res.redirect('/admin/products')).catch((err) => {
        console.log(err);
    });
};

exports.getProducts = (req, res) => {
    Product.findAll().then((products) => {
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
    const productId = +req.body.id;
    Product.findByPk(productId).then((product) => {
        return product.destroy();
    }).then(() => res.redirect('/admin/products')).catch((err) => {
        console.log(err);
    });
};
