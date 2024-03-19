const { DataTypes } =  require('sequelize');
const sequelize =  require('../config/database');

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
  }
}, {
  modelName: 'Apostadores',
  timestamps: false
});

sequelize.sync({ force: true })
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
  })
  .catch(err => {
    console.error('Erro ao sincronizar os modelos com o banco de dados:', err);
  });

module.exports = Apostadores;