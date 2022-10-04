FROM node:16-alpine AS build
WORKDIR /app
COPY ./api/package*.json ./
RUN npm install
COPY ./api .
RUN npm run build
CMD ["npm", "run", "start"]

# FROM node:16-alpine
# WORKDIR /app
# # COPY ./api/package.json ./
# # RUN npm install 
# COPY --from=build ./app/build .
# COPY --from=build ./app/node_modules .
# CMD ["npm", "run", "start"]
EXPOSE 4000

