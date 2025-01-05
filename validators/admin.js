const {body, param, check} = require("express-validator");


exports.postAddProduct = [
    body("title").matches(/^[a-zA-Z0-9 \-#&]{3,100}$/),
    body("price").isCurrency(),
    body("description").matches(/^[a-zA-Z0-9 \-#&]{5,500}$/),
    body("image").notEmpty()
    // body("image").custom(async function (input, {req}) {
    //     if (!input) {
    //         throw new Error("Please enter a valid image");
    //     }
    // })
    // body("imageUrl").isURL({
    //     protocols: ["https"],
    //     require_valid_protocol: true,
    // })
]

exports.getEditProduct = [
    param("productId").isMongoId(),
]

exports.postEditProduct = [
    body("id").isMongoId(),
    body("title").matches(/^[a-zA-Z0-9 \-#&]{3,100}$/),
    body("price").isCurrency(),
    body("description").matches(/^[a-zA-Z0-9 \-#&]{5,500}$/)
    // body("image").custom(async function (input, {req}) {
    //     if (!input) {
    //         throw new Error("Please enter a valid image");
    //     }
    // })
    // body("imageUrl").isURL({
    //     protocols: ["https"],
    //     require_valid_protocol: true,
    // })
]

exports.postDeleteProduct = [
    param("id").isMongoId(),
]
