FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN echo "Installing Node modules..."
RUN npm install

# Bundle app source
COPY . .

RUN npm run build

RUN echo "Starting service at on port 3000.."
EXPOSE 3000

CMD ["npm", "start"]