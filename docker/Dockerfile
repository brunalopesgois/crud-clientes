FROM node:latest

WORKDIR /var/www/code/app
COPY package*.json ./
RUN npm install
COPY . .
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}