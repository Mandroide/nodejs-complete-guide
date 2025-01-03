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
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.postAddProduct = (req, res, next) => {
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
        err.httpStatus = 500;
        return next(err);
        // res.redirect('/500');
        // return res.status(500).render('admin/edit-product', {
        //     pageTitle: 'Add Product',
        //     path: '/admin/add-product',
        //     editing: false,
        //     hasError: true,
        //     errorMessage: 'Database operation failed, please try again.',
        //     product: {
        //         title: req.body.title,
        //         price: req.body.price,
        //         description: req.body.description,
        //         imageUrl: req.body.imageUrl
        //     },
        //     validationErrors: []
        // });
    })

}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit === "true";
    if (!editMode) {
        res.redirect('/');
    } else {
        const productId = req.params.productId;
        Product.findById(productId).then(product => {
            if (!product) {
                req.flash('error', 'Product not found!');
                res.redirect('/admin/products');
            } else {
                res.render('admin/edit-product', {
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    product: product,
                    editing: editMode,
                    hasError: false,
                    errorMessage: null,
                    validationErrors: []
                });
            }
        }).catch(err => {
            err.httpStatus = 500;
            return next(err);
        });
    }
};

exports.postEditProduct = (req, res, next) => {
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
        err.httpStatus = 500;
        return next(err);
    });
};

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
        // .select('title  price -_id')
        // .populate('userId', 'name')
        .then((products) => {
            let errorMessage = req.flash('error');
            errorMessage = (errorMessage.length > 0) ? errorMessage[0] : null;
            res.render('admin/product-list', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                errorMessage: errorMessage,
            });
        }).catch((err) => {
        err.httpStatus = 500;
        return next(err);
    });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.id;
    Product.deleteOne({_id: productId, userId: req.user._id})
        .then(() => res.redirect('/admin/products')).catch((err) => {
        err.httpStatus = 500;
        return next(err);
    });
};
