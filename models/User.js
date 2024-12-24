const Sequelize = require('sequelize')
const sequelize = require('../util/database');

module.exports = sequelize.define('user', {
    id: {
        type: Sequelize.BIGINT(),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    paranoid: true,
});