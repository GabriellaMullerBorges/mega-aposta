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

// Rota para registrar uma nova aposta
router.post('/registrar-aposta', async function(req, res, next) {
  try {
    const { userName, userCPF } = req.body;
    let numeros = req.body.numeros;

    // Se 'numeros' for um array, pega apenas os primeiros 5 elementos e transforma-os em uma string separada por vírgulas
    if (Array.isArray(numeros)) {
      numeros = numeros.slice(0, 5).join(',');
    }
    // Agora, 'numeros' é uma string e pode ser usada para criar a nova aposta
    await Apostas.create({ userName, userCPF, numeros });
    console.log('Esses são os números', numeros);
    console.log(req.session.userCPF, req.session.userName, numeros)
  res.render('sucesso')
  } catch (error) {
    console.log(error); 
    res.send(error);
  }
});


module.exports = router;
