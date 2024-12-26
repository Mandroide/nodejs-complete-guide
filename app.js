const express = require('express');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');
const {mongoConnect} = require('./util/database');
const User = require('./models/User');

const app = express();
const viewEngine = "ejs";
app.set('view engine', viewEngine);
app.set('views', 'views');


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
    User.findByPk('676ca5fc6db1c1587736fe69')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
        }).then(() => next())
        .catch(err => {
            console.log(err);
        });
});

app.use(shopRouter);

app.use('/admin', adminRouter);

app.use(errorController.getNotFound);

mongoConnect(() => {
    app.listen(8080);
})
