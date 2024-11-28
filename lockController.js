// Importações necessárias
const axios = require('axios');
const pool = require('../database'); // Conexão ao PostgreSQL

// Função para validar a senha e trancar a porta
exports.lockDoor = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Consulta ao banco para verificar a senha
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    
    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }
    
    // Requisição para o Arduino para trancar a porta
    const arduinoResponse = await axios.post('http://arduino-ip-address/lock');
    if (arduinoResponse.status === 200) {
      return res.json({ message: 'Porta trancada com sucesso!' });
    } else {
      return res.status(500).json({ message: 'Falha ao trancar a porta no Arduino.' });
    }
    
  } catch (error) {
    console.error('Erro ao trancar a porta:', error);
    res.status(500).json({ message: 'Erro ao processar a requisição.' });
  }
};
