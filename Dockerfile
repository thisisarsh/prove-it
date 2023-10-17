FROM node:18-alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package.json /usr/src/app/
RUN npm install

RUN npm install -g serve

COPY . /usr/src/app

RUN vite build

EXPOSE 8080

CMD [ "serve", "-l", "8080", "-s", "build" ]