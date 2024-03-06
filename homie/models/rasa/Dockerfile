FROM rasa/rasa:3.6.16-full

WORKDIR /app

COPY ./ /app

USER root

EXPOSE 5005

CMD ["run", "-m", "models", "--enable-api", "--cors", "*", "--debug"]
