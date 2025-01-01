const express = require('express');
const isAuth = require('../middleware/is-auth');
const controller = require('../controllers/auth');
const validators = require('../validators/auth');
const sanitizers = require('../sanitizers/auth');

const router = express.Router();

router.get('/login', isAuth.rejectIfCurrentClientIsLoggedIn, controller.getLogin);

router.get('/signup', isAuth.rejectIfCurrentClientIsLoggedIn, controller.getSignup);

router.post('/login', ...validators.login, isAuth.rejectIfLoginValidationFails, controller.postLogin);

router.post('/signup', ...validators.signup, isAuth.rejectIfSignupValidationFails, controller.postSignup);

router.post('/logout', isAuth.rejectIfCurrentClientIsNotLoggedIn, controller.postLogout);

router.get('/reset', isAuth.rejectIfCurrentClientIsLoggedIn, controller.getReset);

router.post('/reset', ...validators.resetPassword, controller.postReset);

router.get('/reset/:token', ...validators.passwordReset, isAuth.rejectIfCurrentClientIsLoggedIn, controller.getNewPassword);

router.post('/new-password', controller.postNewPassword);

module.exports = router;