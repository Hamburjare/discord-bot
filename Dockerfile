FROM node:19

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .

CMD ["npm","start"]
