const bcrypt = require('bcryptjs')
const User = require("../models/User");

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
    });
};

exports.postLogin = (req, res) => {
    User.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
                bcrypt.compare(req.body.password, user.password)
                    .then(doMatch => {
                        if (doMatch) {
                            req.session.isAuthenticated = true;
                            res.cookie("Max-Age", 10);
                            req.session.user = user;
                            return req.session.save(err => {
                                return res.redirect('/')
                            });
                        } else {
                            return res.redirect('/login');
                        }
                    }).catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
            } else {
                return res.redirect('/login');
            }
        }).catch(err => {
        console.log(err);
    });
};

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup'
    });
};

exports.postSignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password === confirmPassword) {
        User.findOne({email: email})
            .then((user) => {
                if (user) {
                    return res.redirect('/signup');
                } else {
                    return bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
                        const user = new User({
                            email: email,
                            password: hashedPassword,
                            cart: {items: []}
                        })
                        return user.save();
                    }).then(() => {
                        res.redirect('/login')
                    });
                }
            })
            .catch(err => console.log(err));
    } else {
        res.redirect('/signup');
    }

};

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
};