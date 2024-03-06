FROM python:3.9.18

WORKDIR /app

USER root

COPY ./ /app

RUN pip install rasa

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5055

CMD ["rasa", "run", "actions"]