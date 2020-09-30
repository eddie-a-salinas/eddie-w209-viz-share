#!/bin/bash
set -x
cd /work
env FLASK_APP=w209_final_project_flask.py FLASK_ENV=development flask run --host 0.0.0.0
