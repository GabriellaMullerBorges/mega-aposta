const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Apostadores = require('./apostadores'); 

const Apostas = sequelize.define('Apostas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numeros: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  apostadorCPF: { // usando o CPF como chave
    type: DataTypes.STRING,
    references: {
      model: Apostadores, 
      key: 'cpf', 
    }
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
  timestamps:false,
});

module.exports = Apostas;
