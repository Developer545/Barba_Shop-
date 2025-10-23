# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist/barbershop-frontend ./dist/barbershop-frontend
EXPOSE 3000
CMD ["http-server", "dist/barbershop-frontend", "-p", "3000"]
