FROM node:16.17.0-alpine

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 3500
CMD [ "npm", "start" ]
