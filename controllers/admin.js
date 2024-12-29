const Product = require('../models/Product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.isAuthenticated
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
                    editing: editMode,
                    isAuthenticated: req.isAuthenticated
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }
};

exports.postEditProduct = (req, res) => {
    Product.findByIdAndUpdate(req.body.id, {
        title: req.body.title,
        price: +req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    }).then(() => {
        res.redirect('/admin/products')
    }).catch((err) => {
        console.log(err);
    });
};

exports.getProducts = (req, res) => {
    Product.find()
        // .select('title  price -_id')
        // .populate('userId', 'name')
        .then((products) => {
        res.render('admin/product-list', {
            products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            isAuthenticated: req.isAuthenticated
        });
    }).catch((err) => {
        console.log(err);
    });
}

exports.postDeleteProduct = (req, res) => {
    const productId = req.body.id;
    Product.findByIdAndDelete(productId)
        .then(() => res.redirect('/admin/products')).catch((err) => {
        console.log(err);
    });
};
