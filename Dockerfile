# Use uma imagem base do Node.js
FROM node:18

# Cria e define o diretório de trabalho no contêiner
WORKDIR .

# Copia os arquivos de package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto para o diretório de trabalho no contêiner
COPY . .

# Expõe a porta na qual o app será executado
EXPOSE 3000

# Define a variável de ambiente para produção (opcional)
ENV NODE_ENV=production

# Comando para iniciar o app
CMD ["node", "index.js"]
