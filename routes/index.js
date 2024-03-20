const {Router} = require('express');
const router = Router()
const Apostadores = require('../models/apostadores.js');
const Apostas = require('../models/apostas.js');
const { sequelize } = require('../config/database'); // Ajuste o caminho conforme necessário



// Rota para exibir o formulário de registro como página inicial
router.get('/', (req, res) => {
    res.render('form');
});

// Rota para registrar novo apostador
router.post('/registrar', async (req, res) => {
  console.log("Dados recebidos:", req.body);
  const { nome, cpf , createdAt,  updatedAt} = req.body;

  if (!nome || !cpf) {
    console.log('AAA')
    return res.status(400).send('Nome e CPF são obrigatórios.');
  }

  let apostador = await Apostadores.findOne({ where: { cpf } });

  if (!apostador) {
    apostador = await Apostadores.create({ 
      nome: nome, 
      cpf: cpf, 
      createdAt: createdAt,
      updatedAt: updatedAt,
    });
    console.log("Apostador criado:", apostador);
  }else {
    console.log("Apostador encontrado:", apostador);
  }

  req.session.userCPF = apostador.cpf;
  req.session.userName = apostador.nome;

  console.log('TESTANDO', req.session);

  //salvando a seção para não perder os dados
req.session.save(err => {
    if (err) {
      console.error("Erro ao salvar a sessão:", err);
      return res.status(500).send("Erro interno do servidor");
    }
    res.redirect('/home');
  });
});

  router.get('/home', (req, res) => {
    console.log('TESTANDO de novo', req.session);
    if (req.session.userCPF && req.session.userName) {
      console.log("CPF do usuário na sessão:", req.session.userCPF);
      console.log("Nome do usuário na sessão:", req.session.userName);
      res.render('index', {
        userCPF: req.session.userCPF,
        userName: req.session.userName
      });
    } else {
      res.render('index', {
        userCPF: '',
        userName: 'Usuário não identificado'
      });
    }
  });

module.exports = router;
