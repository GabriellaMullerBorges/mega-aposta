const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sequelize = require('./config/database');

const app = express();
const router = require('./routes/index');

const PORT =  process.env.PORT || 5173

const sessionStoreOptions = {
    host: 'localhost', 
    port: 3306, 
    user: 'root', 
    password: 'root', 
    database: 'mega', 
    logging: console.log,
};

const sessionStore = new MySQLStore(sessionStoreOptions);


app.use(express.static('public')); //para poder ver o css
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore, 
    cookie: { 
        secure: false,
        path: '/',
    }
    
}));

app.use(router);

sequelize.sync().then(() => {
    console.log('Banco de dados sincronizado.');
}).catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


module.exports = app;
