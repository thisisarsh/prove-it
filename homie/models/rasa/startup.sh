#!/bin/bash

pip install rasa
#
echo "Training Rasa model..."
rasa train --force

echo "Starting Rasa server..."
rasa run -m models --enable-api --cors "*" --debug


