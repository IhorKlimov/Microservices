FROM node:16.13.1

WORKDIR /
COPY services/service7 services/service7

WORKDIR /services/service7

RUN npm install
EXPOSE 8080
CMD npm start