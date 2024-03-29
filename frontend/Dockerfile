FROM node:20.9-bullseye-slim

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .
