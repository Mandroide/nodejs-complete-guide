const {body} = require("express-validator");

exports.postEditProduct = [
    body("title").trim(),
    body("description").trim()
]
