const path = require('path');
const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).sendFile('shop.html', { root: 'views' });
})

module.exports = router;