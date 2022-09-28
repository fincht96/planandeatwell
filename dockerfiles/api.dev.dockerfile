FROM node:latest

WORKDIR /app

RUN apt-get update

COPY ./api/package*.json ./

RUN npm install

COPY ./api .

EXPOSE 4000

CMD ["npm", "run", "dev"]