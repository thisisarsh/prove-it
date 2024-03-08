#!/bin/bash

source activate homie

conda list

rasa --version

rasa train

rasa run -m models --enable-api --cors '*' --debug