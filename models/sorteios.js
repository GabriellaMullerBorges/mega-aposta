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
  },
  createdAt: {
    type: DataTypes.STRING(200),
    defaultValue: 'hoje'
  },
  updatedAt: {
    type: DataTypes.STRING(200),
    defaultValue: 'hoje'
  }
}, {
  timestamps: false,
});

module.exports = Sorteios;
