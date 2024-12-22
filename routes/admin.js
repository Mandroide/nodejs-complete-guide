const express = require('express')

const router = express.Router();

const products = []

router.get('/add-product', (req, res) => {
    res.sendFile('add-product.html', { root: 'views' });
})

router.post('/add-product', (req, res) => {
    products.push({title: req.body.title});
    res.redirect('/');
})

exports.router = router;
exports.products = products;
