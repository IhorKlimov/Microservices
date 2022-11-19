FROM node:16.13.1

WORKDIR /
COPY services/movies services/movies

WORKDIR /services/movies

RUN npm install
EXPOSE 8080
CMD npm start