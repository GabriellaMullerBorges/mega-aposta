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
    allowNull: false,
    get() {
      return this.getDataValue('numeros').split(','); // Convertendo a string de volta para array
    },
    set(val) {
       this.setDataValue('numeros', val.join(',')); // Convertendo array para string para armazenar
    }
  },
  apostadorCPF: {
    type: DataTypes.INTEGER,
    references: {
      model: Apostadores, 
      key: 'id', 
    }
  }
}, {
  timestamps: false
});

module.exports = Apostas;
