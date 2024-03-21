const {Router} = require('express');
const router = Router()
const Apostadores = require('../models/apostadores.js');
const Apostas = require('../models/apostas.js');
const { sequelize } = require('../config/database'); 
const Sorteios = require('../models/sorteios.js');

// Função para gerar números sorteados
function gerarNumerosSorteados() {
  const numerosSorteados = [];
  while (numerosSorteados.length < 5) {
    const numero = Math.floor(Math.random() * 50) + 1; // Gera um número aleatório entre 1 e 60
    if (!numerosSorteados.includes(numero)) {
      numerosSorteados.push(numero);
    }
  }
  return numerosSorteados;
}

// Função para verificar se há um vencedor
async function verificarVencedor(numerosSorteados) {
  // Buscar todas as apostas do banco de dados
  const todasApostas = await Apostas.findAll();

  // Iterar sobre todas as apostas e verificar se algum jogador acertou os números sorteados
  for (const aposta of todasApostas) {
    const numerosAposta = aposta.numeros.split(',').map(num => parseInt(num));
    const acertos = numerosAposta.filter(num => numerosSorteados.includes(num));
    if (acertos.length === 5) { // Se o jogador acertou os 5 números
      return { aposta, numerosSorteados };
    }
  }

  // Retorna null se nenhum jogador acertou os números sorteados
  return null;
}


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

router.get('/home', async (req, res) => {
  try {
    // Buscar o valor da última rodada na tabela sorteios
    const ultimaRodada = await Sorteios.max('rodada');

    // Se a última rodada não foi encontrada, definir como 0
    const edicao = ultimaRodada ? ultimaRodada + 1 : 1;

    console.log('TESTANDO de novo', req.session);
    if (req.session.userCPF && req.session.userName) {
      console.log("CPF do usuário na sessão:", req.session.userCPF);
      console.log("Nome do usuário na sessão:", req.session.userName);
      res.render('index', {
        userCPF: req.session.userCPF,
        userName: req.session.userName,
        edicao: edicao
      });
    } else {
      res.render('index', {
        userCPF: '',
        userName: 'Usuário não identificado',
        edicao: edicao
      });
    }
  } catch (error) {
    console.error('Erro ao buscar a última rodada:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para registrar uma nova aposta
router.post('/registrar-aposta', async function(req, res, next) {
  console.log('REGISTRANDO')
  try {
    const userName = req.session.userName;
    const userCPF = req.session.userCPF;
      
    let numeros = req.body.numeros;
    if (!userCPF) {
      return res.status(400).send('CPF do usuário não encontrado na sessão.');
    }

    // Se 'numeros' for um array, pega apenas os primeiros 5 elementos e ordena-os em ordem crescente
    if (Array.isArray(numeros)) {
      numeros = numeros.slice(0, 5).sort((a, b) => a - b).join(',');
    }

    const novaAposta = await Apostas.create({
      numeros,
      apostadorCPF: userCPF // Usando o CPF da sessão
    });

    console.log('Nova aposta criada:', novaAposta);
    console.log(req.session.userCPF, req.session.userName, numeros)
    res.render('sucesso');
  } catch (error) {
    console.log(error); 
    res.send(error);
  }
});


//VER NÚMEROS APOSTAODS
router.get('/apostados', async (req, res) => {
  console.log('AQUI APOSTANDO');
  try {
    const userCPF = req.session.userCPF;

    if (!userCPF) {
      return res.status(400).send('CPF do usuário não encontrado.');
    }

    // Buscar apostas do banco de dados filtrando pelo CPF do usuário
    const apostasUsuario = await Apostas.findAll({
      where: { apostadorCPF: userCPF }
    });

    // Converter o array de apostas em uma string de números
    const numerosApostas = apostasUsuario.map(aposta => aposta.numeros).join(' | ');

    console.log('cpf usuario', userCPF, 'aposta dele', numerosApostas);

    res.render('apostados', { numerosApostas });
  } catch (error) {
    console.error('Erro ao buscar apostas:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


// Exibir o formulário de autorização de sorteio
router.get('/autorizar-sorteio', (req, res) => {
  res.render('autorizar-sorteio');
});

// Rota para processar a autorização de sorteio
router.post('/autorizar-sorteio', async (req, res) => {
  const { codigoAutorizacao } = req.body;

  // Verifica se o código de autorização está correto
  if (codigoAutorizacao === 'Contratado') {
    // Redireciona para a rota de realização de sorteio
    res.redirect('/realizar-sorteio');
  } else {
    res.status(401).send('Código de autorização inválido.');
  }
});

//REALIZAR SORTEIO
router.get('/realizar-sorteio', async (req, res) => {
  try {
    let tentativas = 0;
    let numerosSorteados = null;
    let vencedores = [];

     // Obtém o valor atual de rodada do banco de dados
     let sorteio = await Sorteios.findOne({ order: [['rodada', 'DESC']] });
     let rodada = sorteio ? sorteio.rodada : 0;

    while (tentativas < 25 && vencedores.length === 0) {
      numerosSorteados = gerarNumerosSorteados();
      //ordenando os números do sorteio
      numerosSorteados = numerosSorteados.sort((a, b) => a - b);
      console.log('Números sorteados:', numerosSorteados);

      const todasApostas = await Apostas.findAll();

      //verifica se algum apostador acertou os números sorteados
      for (const aposta of todasApostas) {
        const numerosApostados = aposta.numeros.split(',').map(Number);
        const acertos = numerosApostados.filter(numero => numerosSorteados.includes(numero)).length;

        if (acertos === 5) {
          const apostador = await Apostadores.findOne({ where: { cpf: aposta.apostadorCPF } });
          vencedores.push({ cpf: aposta.apostadorCPF, nome: apostador.nome });
        }
      }

      tentativas++;
    }

    vencedores.sort((a, b) => a.nome.localeCompare(b.nome));

    if (vencedores.length > 0) {
      console.log('Sorteio encerrado. Vencedores:', vencedores);
    } else {
      console.log('Sorteio encerrado. Nenhum vencedor encontrado após 25 tentativas.');
    }

     // Incrementa o valor de rodada
     rodada++;

     // Salva o novo sorteio no banco de dados
     await Sorteios.create({ numerosSorteados: numerosSorteados.join(','), rodada });

    res.render('sorteados', { numerosSorteados, vencedores });
  } catch (error) {
    console.error('Erro ao realizar o sorteio:', error);
    res.status(500).send('Erro interno do servidor');
  }
});




module.exports = router;
