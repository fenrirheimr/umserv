FROM node:18.18.0 AS dependency-base

WORKDIR /app
COPY . .

RUN npm ci && npm cache clean --force

EXPOSE 8080

CMD ["npm", "run", "dev"]