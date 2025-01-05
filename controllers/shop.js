const Product = require("../models/Product");
const Order = require("../models/Order");
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit')

exports.getProducts = (req, res, next) => {
    Product.find().then((products) => {
        res.render('shop/product-list', {
            products: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch((err) => {
        err.httpStatus = 500;
        return next(err);
    });

}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId).then((product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    }).catch((err) => {
        err.httpStatus = 500;
        return next(err);
    });

}

exports.getIndex = (req, res, next) => {
    Product.find().then((products) => {
        res.render('shop/index', {
            products: products,
            pageTitle: 'Shop',
            path: '/'
        })
    }).catch((err) => {
        err.httpStatus = 500;
        return next(err);
    });
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then((user) => res.render('shop/cart',
            {
                pageTitle: 'Cart',
                path: '/cart',
                products: user.cart.items
            })).catch((err) => {
        err.httpStatus = 500;
        return next(err);
    });
}

exports.postCart = (req, res, next) => {
    const productId = req.body.id;
    Product.findById(productId)
        .then((product) => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
        .catch((err) => {
            err.httpStatus = 500;
            return next(err);
        });
}

exports.postCartDelete = (req, res, next) => {
    const productId = req.body.id;
    req.user.removeFromCart(productId).then(() => {
        res.redirect('/cart');
    }).catch((err) => {
        err.httpStatus = 500;
        return next(err);
    });
}

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .then((user) => {
            const items = user.cart.items.map((item) => ({quantity: item.quantity, product: {...item.productId._doc}}));
            const order = new Order({
                user: {
                    userId: req.user,
                    email: req.user.email
                },
                items: items,
            });
            return order.save();
        })
        .then(() => req.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch((err) => {
            err.httpStatus = 500;
            return next(err);
        });
}

exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.user._id})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch((err) => {
            err.httpStatus = 500;
            return next(err);
        });

};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId).then((order) => {
        if (!order) {
            return next(new Error('Order Not Found'));
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {
            return next(new Error('Unauthorized'));
        }
        const invoiceName = 'Amazon.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);
        const invoiceNumber = order._id;
        const customerEmail = order.user.email;
        const invoiceDate = order.createdAt;
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        // Table headers
        const nameX = 50;
        const quantityX = 300;
        const priceX = 400;
        let y = 100;

        pdfDoc.fontSize(24).text('Invoice', nameX, y, { align: 'left' });
        y += 20;
        pdfDoc
            .fontSize(14)
            .text(
                '-------------------------------------------------------------------------------------',
                nameX,
                y,
                {
                    align: 'left',
                }
            );
        y += 20;
        pdfDoc.fontSize(12).text('Invoice# ' + invoiceNumber, nameX, y);
        y += 20;
        pdfDoc.fontSize(12).text('from ' + moment(invoiceDate).format('MMM Do YYYY'));
        y = 180;
        pdfDoc.fontSize(12).text('Customer: ' + customerEmail, nameX, y);
        y += 20;
        pdfDoc
            .fontSize(14)
            .text(
                '-------------------------------------------------------------------------------------',
                nameX,
                y,
                {
                    align: 'left',
                }
            );
        y += 20;
        pdfDoc.fontSize(12).text('Item', nameX, y, { underline: true });
        pdfDoc.text('Quantity', quantityX, y, { underline: true });
        pdfDoc.text('Price', priceX, y, { underline: true });
        y += 20;
        // Table rows
        let totalPrice = 0;
        order.items.forEach((item) => {
            totalPrice += item.quantity * item.product.price;
            pdfDoc.fontSize(10).text(item.product.name, nameX, y);
            pdfDoc.text(item.quantity, quantityX, y);
            pdfDoc.text(`$${item.product.price}`, priceX, y);
            y += 10; // Moving to next line
        });

        y += 10;

        pdfDoc
            .fontSize(14)
            .text(
                '-------------------------------------------------------------------------------------',
                nameX,
                y,
                {
                    align: 'left',
                }
            );
        y += 20;
        pdfDoc.fontSize(16).text('Total Price: $' + totalPrice, nameX, y, { align: 'left' });

        pdfDoc.end();
        // res.sendFile(invoicePath);
    }).catch((err) => {
        next(err);
    })

}