#website
FROM quay.io/centos7/httpd-24-centos7:latest as website
COPY ./landing-page /var/www/html/


# #storage-service
# FROM node:alpine as storage
# WORKDIR /var/www/data
# WORKDIR /var/www/html
# COPY ./landing-page /var/www/html/
# # WORKDIR /storage-service
# WORKDIR /var/www/html/storage-service
# COPY ./storage-service/package.json ./
# COPY ./storage-service/.env.stage ./.env
# COPY ./storage-service/index.js ./
# # Install app dependencies
# RUN npm install 
# RUN npm install -g concurrently serve
# # Bundle app source
# EXPOSE 3002
# CMD [ "npm", "start" ]