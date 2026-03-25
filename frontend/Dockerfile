# ЭТАП 1: Сборка
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ЭТАП 2: Раздача через Nginx
FROM nginx:stable-alpine as production-stage
# Копируем билд (у Vite это папка dist, у CRA это build)
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]