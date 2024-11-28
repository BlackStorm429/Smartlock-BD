# Use a imagem base do Node.js
FROM node:18

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências de produção
RUN npm install --production

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta (Railway automaticamente redireciona as portas, mas é bom definir)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "app.js"]
