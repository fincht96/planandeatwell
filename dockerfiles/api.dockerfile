FROM node:latest AS build
WORKDIR /app
RUN apt-get update
COPY ./api/package*.json ./
RUN npm install
COPY ./api .
RUN npm run build

FROM node:12.17.0-alpine
WORKDIR /app
COPY ./api/package.json ./
RUN npm install --only=production
COPY --from=build ./app/build ./build
CMD ["npm", "run", "start"]
EXPOSE 4000

