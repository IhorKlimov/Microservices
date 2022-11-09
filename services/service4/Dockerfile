FROM node:16.13.1

WORKDIR /
COPY services/service4 services/service4

WORKDIR /services/service4

RUN npm install
EXPOSE 8080
CMD npm start