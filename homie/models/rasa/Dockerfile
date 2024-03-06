FROM python:3.9.18

WORKDIR /app

COPY ./ /app

USER root

ENV HOME=/app/home

RUN pip install --no-cache-dir rasa --progress-bar off

RUN chmod +x startup.sh

EXPOSE 5005

ENTRYPOINT ["/app/startup.sh"]
