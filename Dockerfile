FROM node:16.6.2
WORKDIR /minecraft-server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 25565
CMD [ "node", "." ]