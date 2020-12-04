FROM node:14-slim

WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install

COPY . /usr/src/app
RUN npm run build

EXPOSE 4000

CMD [ "npm", "run", "server" ]