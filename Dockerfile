FROM node:18-alpine

# Set the ENV_VAR environment variable based on the build-time variable
ENV ENV_VAR=$BUILD_ENV

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN if [ "$ENV_VAR" = "dev" ]; then \
        npm install; \
    elif [ "$ENV_VAR" = "prod" ]; then \
        npm install --production; \
    else \
        echo "Invalid value for MY_ENV_VAR"; exit 1; \
    fi

RUN npm install -g serve

COPY . /usr/src/app

RUN npx vite build

EXPOSE 8080

CMD [ "serve", "-l", "8080", "-s", "dist" ]
