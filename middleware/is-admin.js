const {validationResult} = require('express-validator')

module.exports.rejectIfAddProductValidationFails = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                imageUrl: req.body.imageUrl
            },
            validationErrors: errors.array()
        });
    } else {
        next();
    }
}

module.exports.rejectIfEditProductValidationFails = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                _id: req.body.productId
            },
            validationErrors: errors.array()
        });
    } else {
        next();
    }
}