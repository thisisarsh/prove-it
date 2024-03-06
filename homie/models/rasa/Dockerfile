FROM rasa/rasa:3.6.16-full

WORKDIR /app

COPY ./ /app

USER root

RUN rasa train --force

EXPOSE 5005

CMD ["run", "-m", "models", "--enable-api", "--cors", "*", "--debug"]
