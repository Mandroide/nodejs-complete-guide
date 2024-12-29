const User = require("../models/User");
exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isAuthenticated
    });
};

exports.postLogin = (req, res) => {
    req.session.isAuthenticated = true;
    res.cookie("Max-Age", 10);
    User.findOne().then((user) => {
        if (!user) {
            const user = new User({
                name: 'NodeJS',
                email: 'nodejs@gmail.com',
                cart: {
                    items: []
                }
            });
            return user.save();
        } else {
            return user;
        }
    }).then((user) => {
        req.session.user = user;
    }).then(() => res.redirect('/'))
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
};