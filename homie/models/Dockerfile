FROM rasa/rasa:latest

WORKDIR /app

COPY ./rasa /app

RUN pip install --no-cache-dir -r requirements.txt

RUN rasa train --force

EXPOSE 5005

CMD ["run", "-m", "models", "--enable-api", "--cors", "*", "--debug"]
