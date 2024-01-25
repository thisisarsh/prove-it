FROM node:18-alpine

ARG BUILD_ENV=dev
ENV ENV_VAR=$BUILD_ENV

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

#RUN if [ "$ENV_VAR" = "dev" ]; then \
#        npm install; \
#    elif [ "$ENV_VAR" = "prod" ]; then \
#        npm install --production; \
#    else \
#        echo "Invalid value for ENV_VAR"; exit 1; \
#    fi

RUN npm install

COPY . /usr/src/app

EXPOSE 5000

CMD [ "node", "index.js" ]
