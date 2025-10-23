# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist/barbershop-frontend ./dist/barbershop-frontend
EXPOSE 3000
CMD ["http-server", "dist/barbershop-frontend", "-p", "3000"]
