FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN yarn

COPY . .

EXPOSE 5173

CMD [ "yarn", "dev", "--host"]