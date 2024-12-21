const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.use('/add-product', (req, res) => {
    res.status(200).send("<form action='/product' method='post'><input type='text' name='title'><button type='submit'>Add Product</button> </form>");
})

app.post('/product', (req, res) => {
    console.log(req.body)
    res.redirect('/');
})

app.use('/', (req, res, next) => {
    res.status(200).send("<h1>Hello From Express!</h1>");
})

app.listen(8080);