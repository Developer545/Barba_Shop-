# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN chmod +x node_modules/.bin/* && ./node_modules/.bin/ng build

# Stage 2: Runtime with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/barbershop-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
