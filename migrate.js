const sequelize = require('./config/database');
const Apostadores = require('./models/apostadores');
const Apostas = require('./models/apostas'); 
const Sorteios = require('./models/sorteios'); 

sequelize.sync()
.then(() => { 
    console.log('Tabelas criadas com sucesso');
})
.catch((error) => {
    console.error('Erro ao criar as tabelas:', error);
});
