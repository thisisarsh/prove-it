FROM python:3.9.18

WORKDIR /app

RUN python -m venv venv
ENV PATH="/app/venv/bin:$PATH"

RUN mkdir -p /app/.rasa

COPY ./ /app

RUN chown -R nobody:nogroup /app
USER nobody

ENV HOME=/app/home

RUN pip install --no-cache-dir rasa --progress-bar off

RUN chmod +x startup.sh

EXPOSE 5005

ENTRYPOINT ["/app/startup.sh"]
