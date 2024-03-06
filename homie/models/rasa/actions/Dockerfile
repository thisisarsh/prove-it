FROM rasa/rasa-sdk:latest

WORKDIR /app

USER root

COPY ./ /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5055

CMD ["start", "--actions", "actions"]