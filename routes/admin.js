const express = require('express')

const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const adminValidator = require('../validators/admin');
const sanitizers = require('../sanitizers/auth');

// /admin/add-product => GET
router.get('/add-product', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminController.getAddProduct)

// /admin/add-product => POST
router.post('/add-product', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminValidator.postAddProduct, isAdmin.rejectIfAddProductValidationFails,  adminController.postAddProduct)

// /admin/products => GET
router.get('/products', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminController.getProducts)

// /admin/add-product => GET
router.get('/edit-product/:productId', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminController.getEditProduct)

router.post('/edit-product', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminValidator.postEditProduct, isAdmin.rejectIfEditProductValidationFails, adminController.postEditProduct)

router.post('/delete-product', isAuth.rejectIfCurrentClientIsNotLoggedIn, adminController.postDeleteProduct)

module.exports = router;
