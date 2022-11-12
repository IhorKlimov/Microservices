FROM node:16.13.1

WORKDIR /
COPY services/goods services/goods

WORKDIR /services/goods

RUN npm install
EXPOSE 8080
CMD npm start