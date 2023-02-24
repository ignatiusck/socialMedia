FROM node:slim

WORKDIR /app

COPY /dist /app
COPY package.json ./
COPY package-lock.json ./

ENV MONGO_USER=node-complete
ENV MONGO_PASSWORD=nodecomplete
ENV MONGO_DATABASE=message
ENV JWT_TOKEN=supersecreat

EXPOSE 8080

RUN npm install

CMD ["npm", "start"]