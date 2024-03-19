const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('mega','root','root', {
    host: 'localhost',
    dialect: 'mysql'
});

const Session = sequelize.define('Session', {
    token: DataTypes.STRING,
    expires: DataTypes.DATE
  });

module.exports = sequelize;