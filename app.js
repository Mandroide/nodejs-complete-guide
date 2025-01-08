const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const cookieParser = require("cookie-parser");
const multer = require("multer");
/** CSRF-CSRF PACKAGE */
const {csrfSync} = require('csrf-sync');
const connectFlash = require('connect-flash');
const compression = require('compression');
const helmet = require('helmet');
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
    const fileStorage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'images');
        },
        filename: (req, file, callback) => {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });

    const fileFilter = (req, file, callback) => {
        callback(null, ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype));
    }
    app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"));
    app.use(express.static('public'));
    // Alternative to render
    // app.use('/images', express.static('images'));
    app.use(express.static('images'));
    app.use(helmet());
    // app.use(
    //     helmet.contentSecurityPolicy({
    //         useDefaults: true,
    //         directives: {
    //             "img-src": ["'self'", "https: data:"],
    //             "script-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://maxcdn.bootstrapcdn.com", "https://cdn.jsdelivr.net"],
    //         }
    //     })
    // );
    app.use(compression())

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
    app.use(cookieParser());
    // CSRF must go after session. For all post forms should be hidden type
    const {csrfSynchronisedProtection} = csrfSync({
        getTokenFromRequest: (req) => req.body["CSRFToken"] ?? req.headers["x-csrf-token"],
    });
    app.use(csrfSynchronisedProtection);
    app.use(connectFlash());
    // Assign local variables for views
    app.use((req, res, next) => {
        res.locals.isAuthenticated = req.session.isAuthenticated;
        res.locals.csrfToken = req.csrfToken();
        next();
    });

    app.use((req, res, next) => {
        if (req.session.user) {
            User.findOne(req.session.user._id)
                .then((user) => {
                    if (user) {
                        req.user = user;
                    }
                }).then(() => next())
                .catch((err) => {
                    err.httpStatus = 500;
                    return next(err);
                });
        } else {
            next();
        }
    });

    app.use(authRouter);

    app.use(shopRouter);

    app.use('/admin', adminRouter);

    app.use('/500', errorController.get500);

    app.use(errorController.getNotFound);

    app.use((err, req, res, next) => {
        errorController.get500(req, res);
    })
    app.listen(process.env.PORT);
}).catch(err => {
    console.log(err);
})