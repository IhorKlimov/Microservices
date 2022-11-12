FROM node:16.13.1

WORKDIR /
COPY services/notifications services/notifications

WORKDIR /services/notifications

RUN npm install
EXPOSE 8080
CMD npm start