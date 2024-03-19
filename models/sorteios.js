const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sorteios = sequelize.define('Sorteios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numerosSorteados: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rodada: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Sorteios;
