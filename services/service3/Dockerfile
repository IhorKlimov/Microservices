FROM python:3.6
LABEL maintainer="lorenz.vanthillo@gmail.com"

WORKDIR /

COPY services/service3 services/service3

WORKDIR /services/service3

RUN pwd
RUN pip install -r requirements.txt

EXPOSE 8080
ENTRYPOINT ["python"]
CMD ["app/main.py"]