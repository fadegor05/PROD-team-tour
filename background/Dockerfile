FROM python:3.12.2-alpine3.19

WORKDIR /background

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD python run.py