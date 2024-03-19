const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const indexRouter = require('./routes/index');

const PORT = 5173;

// Opções para o express-mysql-session.
const sessionStoreOptions = {
    host: 'localhost', // ou seu host de banco de dados
    port: 3306, // ou a porta do seu banco de dados
    user: 'root', // seu usuário do banco de dados
    password: 'root', // sua senha do banco de dados
    database: 'mega' // o nome do seu banco de dados
};

const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    store: sessionStore, 
    cookie: { secure: false }
}));

app.use('/', indexRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
