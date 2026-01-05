FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM alpine:3.19

WORKDIR /build
COPY --from=builder /app/dist .


# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5173

# CMD ["npm", "run", "dev"]