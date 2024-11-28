const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const User = require('models/User'); 
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize('smartlock', 'admin_smartlock', '$$Senha1234', {
  host: 'smartlock.postgres.database.azure.com',
  dialect: 'postgres',
  port: 5432,
  ssl: true,  
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false  
    }
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexão ao banco de dados PostgreSQL estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao PostgreSQL:', err);
  });

// Rota de cadastro
app.post('/cadastrar', async (req, res) => {
  const { name, email, password, doorPassword } = req.body;

  if (!name || !email || !password || !doorPassword) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const user = await User.create({ name, email, password, doorPassword });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário, verifique os dados.' });
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    res.json({ message: 'Login bem-sucedido!', user: { name: user.name, email: user.email } });

  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ error: 'Erro ao realizar login, tente novamente.' });
  }
});

app.post('/verifydoorpass', async (req, res) => {
  const { email, doorPassword } = req.body;
  
  if (!email || !doorPassword) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const isPasswordValid = await bcrypt.compare(doorPassword, user.doorPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    res.json({ message: 'Senha da porta verificada com sucesso!', user: { name: user.name, email: user.email } });

  } catch (error) {
    console.error('Erro ao comparar senha da porta:', error);
    res.status(500).json({ error: 'Erro ao comparar senha da porta, tente novamente.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});