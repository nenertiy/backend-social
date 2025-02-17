FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm && \ 
    pnpm i

COPY . .

RUN npx prisma generate

RUN pnpm run build

CMD [ "pnpm", "run", "start"]