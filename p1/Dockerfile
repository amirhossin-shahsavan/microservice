FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && npm install
COPY . .
CMD ["node", "project1"]
