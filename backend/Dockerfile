FROM python:3.11-slim-bullseye

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip3 install --upgrade pip
RUN pip3 install -r /app/requirements.txt --no-cache-dir

COPY . .
