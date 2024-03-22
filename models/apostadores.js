const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Apostadores = sequelize.define('Apostadores', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true 
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
  modelName: 'Apostadores',
  timestamps: false 
});

module.exports = Apostadores;
