FROM python:3.9.18

WORKDIR /app

RUN python -m venv venv
ENV PATH="/app/venv/bin:$PATH"

RUN mkdir -p /app/.rasa/cache /app/home && \
    chown -R nobody:nogroup /app

USER nobody

RUN pip install rasa --no-cache-dir --progress-bar off

COPY --chown=nobody:nogroup ./ /app

RUN rasa train --force

RUN chmod +x startup.sh

EXPOSE 5005

ENTRYPOINT ["/app/startup.sh"]
