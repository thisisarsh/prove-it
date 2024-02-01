FROM node:18-alpine

ARG BUILD_ENV=prod
ENV ENV_VAR=$BUILD_ENV

ARG VITE_SERVER
ENV VITE_SERVER=$VITE_SERVER

RUN apk add --no-cache gettext # for envsubst

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

RUN npm install -g serve

COPY . /usr/src/app

RUN echo "ENV_VAR is set to $ENV_VAR"

RUN npx vite build

COPY scripts/startup.sh /usr/src/app/startup.sh

RUN chmod -R 777 /usr/src/app/dist/assets

RUN chmod +x /usr/src/app/startup.sh

EXPOSE 8080

CMD [ "/usr/src/app/startup.sh" ]
