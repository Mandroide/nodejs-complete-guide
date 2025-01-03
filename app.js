const express = require('express');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

const bodyParser = require('body-parser');

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, {through: OrderItem});

sequelize.sync()
    .then(() => User.findByPk(1))
    .then(result => (!result) ? User.create({name: 'Max', email: 'test@test.com'}) : result)
    .then(() => {
        const app = express();
        const viewEngine = "ejs";
        app.set('view engine', viewEngine);
        app.set('views', 'views');

        app.use(bodyParser.urlencoded({extended: true}));
        app.use(express.static('public'));

        app.use((req, res, next) => {
            User.findByPk(1)
                .then(user => {
                    req.user = user;
                    return user.createCart();
                }).then(() => next())
                .catch(err => {
                    console.log(err);
                });
        });

        app.use(shopRouter);

        app.use('/admin', adminRouter);

        app.use(errorController.getNotFound);
        app.listen(8080);
    }).catch((err) => {
    console.log(err);
})