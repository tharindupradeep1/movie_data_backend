
FROM node:22.6.0

# Set the working directory inside the container
WORKDIR /app

# copy package.json, package-lock.json files to working directory
COPY package*.json ./

RUN npm install

# copy all application code
COPY . .

# build app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
