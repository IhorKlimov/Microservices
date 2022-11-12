FROM node:16.13.1

WORKDIR /
COPY services/service5 services/service5

WORKDIR /services/service5

RUN npm install
EXPOSE 8080
CMD npm start