const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const cookieParser = require("cookie-parser");
const errorController = require('./controllers/error');
const User = require('./models/User');
const env = require("dotenv")

env.config();

mongoose.connect('mongodb+srv://cluster0.gwokf.mongodb.net/', {
    w: 'majority',
    appName: 'Cluster0',
    retryWrites: true,
    authSource: "admin",
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD
}).then(() => {
    const app = express();
    const viewEngine = "ejs";
    app.set('view engine', viewEngine);
    app.set('views', 'views');

    app.use(express.urlencoded({extended: true}));
    app.use(express.static('public'));

    app.use(cookieParser());

    app.use((req, res, next) => {
        req.isAuthenticated = req.cookies.isAuthenticated === "true";
        next();
    });

    app.use((req, res, next) => {
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
            req.user = user;
        }).then(() => next())
            .catch(err => {
                console.log(err);
            });
    });

    app.use(authRouter);

    app.use(shopRouter);

    app.use('/admin', adminRouter);

    app.use(errorController.getNotFound);
    app.listen(8080);
}).catch(err => {
    console.log(err);
})