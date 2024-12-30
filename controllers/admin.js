const Product = require('../models/Product');

/*
TODO 2024-12-30 Change getEditProducts to redirect to admin products with a flash message you aren't authorized to
 edit product in addition to changing the post requests. Also is there a reason why we do not encrypt the productId
 that is passed into getEditProduct so we eliminate any chance of users reaching the getEdit route when they are not
 supposed to(not by clicking on the edit button of a admin product)
 */
exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res) => {
    const product = new Product(
        {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            userId: req.user,
        });
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
        Product.findById(productId).then(product => {
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
    Product.findById(req.body.id)
        .then(product => {
            if (product.userId.toString() === req.user.toString()) {
                product.title = req.body.title;
                product.price = +req.body.price;
                product.description = req.body.description;
                product.imageUrl = req.body.imageUrl;
                return product.save().then(() => res.redirect('/admin/products'))
            } else {
                return res.redirect('/');
            }
        }).catch((err) => {
        console.log(err);
    });
};

exports.getProducts = (req, res) => {
    Product.find({userId: req.user._id})
        // .select('title  price -_id')
        // .populate('userId', 'name')
        .then((products) => {
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
    Product.deleteOne({_id: productId, userId: req.user._id})
        .then(() => res.redirect('/admin/products')).catch((err) => {
        console.log(err);
    });
};
