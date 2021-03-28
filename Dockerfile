FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.config AND package-lock.config are copied
COPY package*.json ./
COPY .env ./
COPY src/ ./

RUN rm -rf ./src/node_modules

RUN npm install --silent

# Bundle app source
COPY . .

EXPOSE 80