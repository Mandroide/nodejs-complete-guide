const express = require('express')

const app = express()

/**
 * This for regex start
 */
app.use('/add-product', (req, res, next) => {
    console.log("In add product middleware!");
    res.status(200).send("<h1>The 'Add Product' Page</h1>");
})

app.use('/', (req, res, next) => {
    console.log("In another middleware!");
    res.status(200).send("<h1>Hello From Express!</h1>");
})

app.listen(8080);