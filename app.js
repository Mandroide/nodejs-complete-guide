const express = require('express');
const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

const bodyParser = require('body-parser');

const app = express();

const viewEngine = "ejs";
app.set('view engine', viewEngine);
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.use(shopRouter);

app.use('/admin', adminData.router);

app.use((req, res, next) => {
    res.status(404).render("not-found", {
        pageTitle: "Page Not Found",
        layout: false,
    });
});


app.listen(8080);