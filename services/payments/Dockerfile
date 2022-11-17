FROM python:3.9.13

WORKDIR /
COPY services/payments services/payments

WORKDIR /services/payments

RUN pip install -r requirements.txt

EXPOSE 8080
ENTRYPOINT ["python"]
CMD ["app/main.py"]