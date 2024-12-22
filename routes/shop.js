const path = require('path');
const express = require('express')

const router = express.Router()
const adminData = require('./admin');

router.get('/', (req, res, next) => {
    const products = adminData.products;

    res.render('shop', {products: products, pageTitle: 'Shop', path: '/'});
})

module.exports = router;