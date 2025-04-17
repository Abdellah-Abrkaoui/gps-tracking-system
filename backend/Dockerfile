FROM python:3.13.2-slim

WORKDIR /app

COPY ./ ./

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "-c", "import subprocess; subprocess.run(['python', 'seed.py']); import uvicorn; uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)"]

