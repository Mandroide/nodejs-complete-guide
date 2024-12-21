const express = require('express')
const path = require("node:path");

const router = express.Router();

router.get('/add-product', (req, res) => {
    res.sendFile('add-product.html', { root: 'views' });
})

router.post('/product', (req, res) => {
    console.log(req.body)
    res.redirect('/');
})

module.exports = router;


