const Sequelize = require("sequelize");
const sequelize = require("../util/database");

module.exports = sequelize.define("cartItem", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    unitPrice: {
        type: Sequelize.DECIMAL,
        allowNull: false,

    }
}, {
    paranoid: true
});