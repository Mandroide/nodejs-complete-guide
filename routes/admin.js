const express = require('express')

const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const validators = require('../validators/auth');
const sanitizers = require('../sanitizers/auth');

// /admin/add-product => GET
router.get('/add-product', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminController.getAddProduct)

// /admin/add-product => POST
router.post('/add-product', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminController.postAddProduct)

// /admin/products => GET
router.get('/products', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminController.getProducts)

// /admin/add-product => GET
router.get('/edit-product/:productId', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminController.getEditProduct)

router.post('/edit-product', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminController.postEditProduct)

router.post('/delete-product', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminController.postDeleteProduct)

module.exports = router;
