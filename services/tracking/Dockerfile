FROM node:16.13.1

WORKDIR /
COPY services/tracking services/tracking

WORKDIR /services/tracking

RUN npm install
EXPOSE 8080
CMD npm start