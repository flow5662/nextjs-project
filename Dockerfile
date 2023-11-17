FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

COPY .next ./.next

CMD ["npm", "start"]

# # Specify a base image
# FROM node:alpine

# # install some depenendencies
# COPY ./ ./

# RUN npm install

# COPY .next ./.next

# # Default command
# CMD ["npm", "start"] 
