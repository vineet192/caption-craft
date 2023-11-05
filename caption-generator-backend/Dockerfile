FROM python:3.9
# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

COPY requirements.txt /
RUN pip install -r requirements.txt

COPY . /app

EXPOSE 8080

WORKDIR /app

CMD exec gunicorn 'wsgi:create_app()' -b 0.0.0.0:8080 --timeout=900

