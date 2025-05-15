#!/bin/sh

python rpc.py &

python seed.py

if [ "$APP_ENV" = "development" ]; then
  exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload
else
  exec uvicorn main:app --host 0.0.0.0 --port 8000
fi

