# 1. Node image
FROM node:20-alpine

# 2. Ishlash papkasi
WORKDIR /app

# 3. package.json va package-lock.json ni nusxalash
COPY package*.json ./

# 4. Dependencies o'rnatish
RUN npm install

# 5. Boshqa fayllarni nusxalash
COPY . .

# 6. Port
EXPOSE 5000

# 7. Server ishga tushirish
CMD ["node", "src/server.js"]
