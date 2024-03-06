FROM python:3.9.18

WORKDIR /app

COPY ./ /app

USER root

RUN chmod +x startup.sh

EXPOSE 5005

ENTRYPOINT ["/app/startup.sh"]
