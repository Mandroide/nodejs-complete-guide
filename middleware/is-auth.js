// module.exports = (req, res, next) => {
//     if (req.session.isAuthenticated) {
//         return next();
//     } else {
//         return res.redirect('/login');
//     }
// }

const {validationResult} = require('express-validator')

module.exports.rejectIfCurrentClientIsNotLoggedIn = (request, response, next) => {
    const {session: {isAuthenticated}} = request;
    if (!isAuthenticated) return response.redirect(`/auth/signIn`);

    next();
}

module.exports.rejectIfLoginValidationFails = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: req.body.email,
                password: req.body.password
            },
            validationErrors: errors.array()
        });
    } else {
        next();
    }
}

exports.rejectIfSignupValidationFails = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: req.body.email,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        });
    } else {
        next();
    }
}

module.exports.rejectIfCurrentClientIsLoggedIn = (request, response, next) => {

    const {session: {currentClientIsLoggedIn}} = request;

    if (currentClientIsLoggedIn) {
        return response.back();
    }
    next();
}

module.exports.rejectIfCurrentClientIsNotUser = (request, response, next) => {
    const {session: {currentClientIsLoggedAsWhat}} = request;

    if (currentClientIsLoggedAsWhat !== 'asUser') {
        return response.back();
    }
    next();
}

module.exports.rejectIfCurrentClientIsNotSeller = (request, response, next) => {
    const {session: {currentClient, currentClientIsLoggedIn, currentClientIsLoggedAsWhat}} = request;

    if (currentClientIsLoggedAsWhat !== 'asSeller') {
        return response.back();
    }
    next();
}