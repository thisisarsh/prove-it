FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

RUN npm install -g serve

COPY . /usr/src/app

RUN npx vite build

EXPOSE 8080

CMD [ "serve", "-l", "8080", "-s", "dist" ]
