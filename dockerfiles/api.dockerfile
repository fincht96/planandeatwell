FROM node:16-alpine AS build
WORKDIR /app
COPY ./api .
RUN npm ci
RUN npm run build

FROM node:16-alpine
COPY --from=build ./app/build ./build
COPY --from=build ./app/node_modules ./node_modules
COPY --from=build ./app/package*.json ./
CMD ["npm", "run", "start"]

EXPOSE 4000

