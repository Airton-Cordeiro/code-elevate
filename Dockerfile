FROM node:20

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --include=dev
RUN npm install -g nodemon ts-node

# Bundle app source
COPY . .

EXPOSE 8000
CMD ["npm", "run", "start:dev"]