FROM node:18-alpine

LABEL maintainer="https://suk.kr"

ENV TZ=Asia/Seoul

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "start"]