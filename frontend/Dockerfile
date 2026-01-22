FROM node:20-alpine AS build

WORKDIR /app

# bash va tini paketini qo‘shish (ba’zi permissions va scripts uchun)
RUN apk add --no-cache bash tini

COPY package*.json ./
RUN npm install

COPY . .

# PATH’ni tekshirish va executable ruxsat berish
RUN chmod +x ./node_modules/.bin/vite

# build
RUN npm run build

# Nginx orqali serve qilish
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
