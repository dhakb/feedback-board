FROM node:20.18.0-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

#RUN npx prisma generate

#RUN npm run build

#EXPOSE 8080

#CMD ["npm", "start"]