FROM rasa/rasa-sdk:latest

WORKDIR /app

COPY ./ /app/actions

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5055

CMD ["rasa", "run", "actions"]