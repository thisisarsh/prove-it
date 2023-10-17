FROM node:18-alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package.json /usr/src/ht_webb/

RUN npm install

RUN npx vite --version

RUN npm install -g serve

COPY . /usr/src/app

RUN npx vite build

EXPOSE 8080

CMD [ "serve", "-l", "8080", "-s", "build" ]