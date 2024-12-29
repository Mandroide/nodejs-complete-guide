const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
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
    const store = new MongoDBStore({
        uri: process.env.MONGODB_URI,
        collection: 'sessions',
    })
    app.use(session({
        secret: process.env.SESSION_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store
    }));

    app.use((req, res, next) => {
        if (req.session.user) {
            User.findOne(req.session.user._id)
                .then((user) => {
                    req.user = user;
                }).then(() => next())
                .catch(err => {
                    console.log(err);
                });
        } else {
            next();
        }
    });

    app.use(authRouter);

    app.use(shopRouter);

    app.use('/admin', adminRouter);

    app.use(errorController.getNotFound);
    app.listen(8080);
}).catch(err => {
    console.log(err);
})