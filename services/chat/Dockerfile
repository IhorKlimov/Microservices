FROM node:16.13.1

WORKDIR /
COPY services/chat services/chat

WORKDIR /services/chat

RUN npm install
EXPOSE 8080
CMD npm start