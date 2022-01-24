FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}