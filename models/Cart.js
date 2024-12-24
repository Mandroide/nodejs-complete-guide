const Sequelize = require('sequelize');
const sequelize = require('../util/database');

module.exports = sequelize.define('cart', {
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }
}, {
    paranoid: true
})