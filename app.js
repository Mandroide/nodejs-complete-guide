const express = require('express');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const bodyParser = require('body-parser');

sequelize.sync().then((result) => {
    const app = express();
    const viewEngine = "ejs";
    app.set('view engine', viewEngine);
    app.set('views', 'views');

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static('public'));

    app.use(shopRouter);

    app.use('/admin', adminRouter);

    app.use(errorController.getNotFound);
    app.listen(8080);
}).catch((err) => {
    console.log(err);
})