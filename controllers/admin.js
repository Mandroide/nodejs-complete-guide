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
    product.save().then(() => {
        res.redirect('/');
    }).catch(err => {
        console.log(err)
    });

}

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit === "true";
    if (!editMode) {
        res.redirect('/');
    } else {
        const productId = +req.params.productId;
        Product.findById(productId).then(({rows}) => {
            const row = rows[0];
            if (!row) {
                res.redirect('/');
            } else {
                res.render('admin/edit-product', {
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    product: row,
                    editing: editMode
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }
};

exports.postEditProduct = (req, res) => {
    const product = new Product(+req.body.id, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    product.save.then(() => {
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err)
    });
};

exports.getProducts = (req, res) => {
    Product.fetchAll().then(({rows}) => {
        res.render('admin/product-list', {
            products: rows,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch((err) => {
        console.log(err);
    });
}

exports.postDeleteProduct = (req, res) => {
    const productId = +req.body.id;
    Product.deleteById(productId).then(() => {
        res.redirect('/admin/products');
    });
};
