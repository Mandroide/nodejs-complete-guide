const {body, param} = require("express-validator");
const User = require("../models/User");
const Seller = require("../models/Order");

exports.login = [
    body('email')
        .normalizeEmail().trim(),
];

exports.signup = [
    body('asWhat')
        .exists({checkFalsy: true}).withMessage('You must choose as what you would be signed up')
        .isIn(['asUser', 'asSeller']).withMessage('You can only sign up as a User or as a Seller'),
    body('firstName')
        .exists({checkFalsy: true}).withMessage('You must type a first name')
        .isAlpha('es-ES', {ignore: ' '}).withMessage('The first name must contain only letters'),
    body('lastName')
        .exists({checkFalsy: true}).withMessage('You must type a last name')
        .isAlpha('es-ES', {ignore: '\s'}).withMessage('The last name must contain only letters'),
    body('phone')
        .exists({checkFalsy: true}).withMessage('You must type a phone number')
        .isMobilePhone(['en-US'], {strictMode: false}).withMessage('You must type a proper phone number'),
    body('gender')
        .exists({checkFalsy: true}).withMessage('You must choose one of the two genders')
        .isIn(['male', 'female']).withMessage('You can only sign up as a Male or as a Female'),
    body('email').normalizeEmail(),
    body('password')
        .exists({checkFalsy: true}).withMessage('You must type a password')
        .isLength({min: 5}).withMessage('The password must be at least 5 chars long'),
    body('confirmPassword')
        .exists({checkFalsy: true}).withMessage('You must type a confirmation password')
        .custom((value, {req}) => value === req.body.password).withMessage("The passwords do not match"),
];

exports.passwordReset = [
    param('resetToken')
        .custom((value, {req}) => {
            const {query: {asWhat}} = req;

            if (asWhat === 'asUser') {
                return User.findOne({resetToken: value}).then(user => {
                    if (!user) {
                        return Promise.reject(`The user do not exist`);
                    }
                    if (user.resetTokenExpiration <= Date.now()) {
                        return Promise.reject(`The user's reset token has expired a long time ago`);
                    }
                });
            } else {
                return Seller.findOne({resetToken: value}).then(seller => {
                    if (!seller) {
                        return Promise.reject(`The seller do not exist`);
                    }
                    if (seller.resetTokenExpiration <= Date.now()) {
                        return Promise.reject(`The seller's reset token has expired a long time ago`);

                    }
                });
            }
        }),
];

exports.resetPassword = [
    param('resetToken')
        .custom((value, {req}) => {
            const {body: {asWhat}} = req;

            if (asWhat === 'asUser') {
                return User.findOne({resetToken: value}).then(user => {
                    if (!user) {
                        return Promise.reject(`The user do not exist`);
                    }
                    if (user.resetTokenExpiration <= Date.now()) {
                        return Promise.reject(`The user's reset token has expired`);

                    }
                });
            } else {
                return Seller.findOne({resetToken: value}).then(seller => {
                    if (!seller) {
                        return Promise.reject(`The seller do not exist`);
                    }
                    if (seller.resetTokenExpiration <= Date.now()) {
                        return Promise.reject(`The seller's reset token has expired`);

                    }
                });
            }
        }),
    body('password')
        .exists({checkFalsy: true}).withMessage('You must type a password')
        .isLength({min: 5})
        .withMessage('The password must be at least 5 chars long'),
    body('confirmedPassword')
        .exists({checkFalsy: true}).withMessage('You must type a confirmation password')
        .custom((value, {req}) => value === req.body.password).withMessage("The passwords do not match"),
];