FROM rasa/rasa-sdk:3.6.2

WORKDIR /app

USER root

COPY ./ /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5055

CMD ["start", "--actions", "actions"]