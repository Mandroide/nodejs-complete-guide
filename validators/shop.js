const {body, param} = require("express-validator");

exports.postCart = [
    body("id").isMongoId(),
]

exports.postCartDelete = [
    body("id").isMongoId(),
]

exports.getProduct = [
    param("productId").isMongoId(),
]
