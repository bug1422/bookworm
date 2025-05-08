FROM node:20-alpine3.20 AS build
WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm ci

# ARG VITE_API_HOST
# ARG VITE_API_KEY
# RUN echo "VITE_API_HOST=$VITE_API_HOST" > .env && \
#     echo "VITE_API_KEY=$VITE_API_KEY" >> .env
COPY . .
RUN npm run build

FROM nginx:1.14.2 AS production
WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]