#!/bin/bash

chmod -R 775 .rasa/cache

echo "Training Rasa model..."
rasa train --force

echo "Starting Rasa server..."
rasa run -m models --enable-api --cors "*" --debug


