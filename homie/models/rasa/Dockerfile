FROM python:3.9.18

WORKDIR /app

RUN python -m venv venv
ENV PATH="/app/venv/bin:$PATH"

RUN mkdir -p /app/.rasa/cache /app/home && \
    chown -R nobody:nogroup /app

USER nobody

RUN pip install rasa

COPY --chown=nobody:nogroup ./ /app
RUN chmod +x startup.sh

EXPOSE 5005

ENTRYPOINT ["/app/startup.sh"]
