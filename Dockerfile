FROM node:20

RUN apt-get update && apt-get install -y curl

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --include=dev
RUN npm install -g nodemon ts-node

COPY . .

EXPOSE 8000
CMD ["npm", "run", "start:dev"]