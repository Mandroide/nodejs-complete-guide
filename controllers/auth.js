const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const User = require("../models/User");
const env = require("dotenv")

env.config();

const transporter = nodemailer.createTransport(mailgunTransport({
    auth: {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    }
}))

exports.getLogin = (req, res) => {
    let errorMessage = req.flash('error');
    errorMessage = (errorMessage.length > 0) ? errorMessage[0] : null;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errorMessage
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
                            req.flash('error', 'Invalid Credentials');
                            return res.redirect('/login');
                        }
                    }).catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
            } else {
                req.flash('error', 'Invalid Credentials');
                return res.redirect('/login');
            }
        }).catch(err => {
        console.log(err);
    });
};

exports.getSignup = (req, res) => {
    let errorMessage = req.flash('error');
    errorMessage = (errorMessage.length > 0) ? errorMessage[0] : null;
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errorMessage
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
                    req.flash('error', 'E-Mail exists already, please pick a different one.');
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
                        res.redirect('/login');
                        return transporter.sendMail({
                            from: `mailgun@${process.env.MAILGUN_DOMAIN}`,
                            to: email,
                            subject: 'Sign up',
                            html: '<h1>You successfully signed up!</h1>'
                        }, function(error, response) {
                            if (error) {
                                console.log(error)
                            } else {
                                console.log("Successfully sent email.")
                            }
                        });
                    }).catch(err => console.log(err));
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