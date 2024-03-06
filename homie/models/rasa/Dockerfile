FROM python:3.9.18

WORKDIR /app

COPY ./ /app

USER root

RUN pip install rasa

EXPOSE 5005

CMD ["rasa", "run", "-m", "models", "--enable-api", "--cors", "*", "--debug"]
