FROM python:3.12.2-alpine3.19

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD python -m uvicorn app:create_app --host 0.0.0.0 --port 8000