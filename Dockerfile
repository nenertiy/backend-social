FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY pnpm-lock.yaml ./  

RUN npm i -g pnpm && \ 
    pnpm install --frozen-lockfile && \
    pnpm cache delete

COPY . .

RUN npx prisma generate

RUN pnpm run build

CMD [ "pnpm", "run", "start"]