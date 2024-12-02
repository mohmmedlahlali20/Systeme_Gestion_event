FROM node:18 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm install --only=production

EXPOSE 3000

CMD ["node", "dist/main"]
