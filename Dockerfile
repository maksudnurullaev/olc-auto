FROM node:20.14-alpine3.19

RUN apk add g++ make py3-pip
RUN apk add tzdata && ln -s /usr/share/zoneinfo/Asia/Tashkent /etc/localtime

EXPOSE 8080

WORKDIR /app
COPY . /app

ENV NODE_ENV=production

CMD ["npm", "start"]
