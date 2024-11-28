FROM node:18-alpine

WORKDIR /

COPY package*.json ./

RUN npm install --production

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["node", "app.js"]
