const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Configuração do Sequelize para o banco de dados na Azure
const sequelize = new Sequelize('smartlock', 'admin_smartlock', '$$Senha1234', {
  host: 'smartlock.postgres.database.azure.com', // Endereço do banco na Azure
  dialect: 'postgres',
  port: 5432,
  ssl: true,  // Habilita a conexão SSL
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false  // Para aceitar conexões SSL
    }
  }
});

// Definindo o modelo User
const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  doorPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hook para criptografar senhas
User.beforeCreate(async (user) => {
  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);
  user.doorPassword = await bcrypt.hash(user.doorPassword, saltRounds);
});

module.exports = User;
