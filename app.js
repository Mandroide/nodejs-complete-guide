const express = require('express');
const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(shopRouter);

app.use('/admin', adminData.router);

app.use((req, res, next) => {
    res.status(404).render("not-found");
});


app.listen(8080);