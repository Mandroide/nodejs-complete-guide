const express = require('express')

const router = express.Router()
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

router.get('/products/:productId', shopController.getProduct)

router.get('/cart', isAuth.rejectIfCurrentClientIsNotLoggedIn, shopController.getCart)
router.post('/cart', isAuth.rejectIfCurrentClientIsNotLoggedIn, shopController.postCart)

router.post('/cart-delete-item', isAuth.rejectIfCurrentClientIsNotLoggedIn, shopController.postCartDelete)

router.get('/orders', isAuth.rejectIfCurrentClientIsNotLoggedIn, shopController.getOrders)

router.post('/create-order', isAuth.rejectIfCurrentClientIsNotLoggedIn, shopController.postOrder)

module.exports = router;