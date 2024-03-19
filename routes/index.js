const express = require('express');
const router = express.Router();
const Apostadores = require('../models/apostadores');
const Apostas = require('../models/apostas');
// const Sorteios = require('../models/sorteios'); // Importação não utilizada no exemplo atual

// Rota da página inicial
router.get('/', async (req, res) => {
  const userCPF = req.session.userCPF;
  let apostas = [];

  if (userCPF) {
      apostas = await Apostas.findAll({ where: { apostadorCPF: userCPF } });
  }

  const isLoggedIn = !!userCPF; // Transforma 'userCPF' em um booleano: true se existe, false se não

  res.render('index', { apostas, isLoggedIn });
});

// Rota para registrar novo apostador
router.post('/registrar', async (req, res) => {
    const { nome, cpf } = req.body;

    // Criar novo apostador com os dados do formulário
    const apostador = await Apostadores.create({ nome, cpf });

    // Armazenar o CPF do apostador na sessão para futuras identificações
    req.session.userCPF = apostador.cpf;

    // Redirecionar para a página inicial após o registro
    res.redirect('/');
});

module.exports = router;
