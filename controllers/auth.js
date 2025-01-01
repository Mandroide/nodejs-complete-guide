const crypto = require('crypto');
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
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
        errorMessage: errorMessage,
        oldInput: {email: req.flash("email"), password: req.flash("password")},
        validationErrors: []
    });
};

exports.postLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password)
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
                            req.flash("email", email);
                            req.flash("password", password);
                            return res.redirect('/login');
                        }
                    }).catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
            } else {
                req.flash('error', 'Invalid Credentials');
                req.flash("email", email);
                req.flash("password", password);
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
        errorMessage: errorMessage,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    });
};

exports.postSignup = (req, res) => {
    const email = req.body.email;
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
                    }, function (error, response) {
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

};

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
};

exports.getReset = (req, res) => {
    let errorMessage = req.flash('error');
    errorMessage = (errorMessage.length > 0) ? errorMessage[0] : null;
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: errorMessage
    });
}

exports.postReset = (req, res) => {
    crypto.randomBytes(32, (err, buf) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        } else {
            const token = buf.toString('hex');
            User.findOne({email: req.body.email}).then((user) => {
                if (user) {
                    user.resetToken = token;
                    user.resetTokenExpiration = Date.now() + 3600;
                    return user.save();
                } else {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset');
                }
            }).then(() => {
                res.redirect('/');
                return transporter.sendMail({
                    from: `mailgun@${process.env.MAILGUN_DOMAIN}`,
                    to: req.body.email,
                    subject: 'Password Reset',
                    html: `<p>You requested a password reset</p>
<p>Click this <a href="http://localhost:8080/reset/${token}">link</a> to set a new password.</p>`
                }, function (error, response) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log("Successfully sent email.")
                    }
                });
            }).catch(err => console.log(err));
        }
    })
    let errorMessage = req.flash('error');
    errorMessage = (errorMessage.length > 0) ? errorMessage[0] : null;
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: errorMessage
    });
}

exports.getNewPassword = (req, res) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then((user) => {
            let errorMessage = req.flash('error');
            errorMessage = (errorMessage.length > 0) ? errorMessage[0] : null;
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: errorMessage,
                userId: user._id.toString(),
                passwordToken: token
            });
        }).catch(err => console.log(err));


}
exports.postNewPassword = (req, res) => {
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (newPassword === confirmPassword) {
        const userId = req.body.userId;
        const passwordToken = req.body.passwordToken;
        let resetUser;
        User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
            .then((user) => {
                resetUser = user;
                return bcrypt.hash(newPassword, 12)
            })
            .then(hashedPassword => {
                resetUser.password = hashedPassword;
                resetUser.resetToken = undefined;
                resetUser.resetTokenExpiration = undefined;
                return resetUser.save();
            }).then(() => res.redirect('/login'))
            .catch(err => console.log(err));
    } else {
        req.flash('error', 'Passwords do not match.');
        res.redirect('/new-password');
    }


}