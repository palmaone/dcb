FROM node:20-alpine AS build

WORKDIR /app

# Copy hardening config and project definition
COPY .npmrc package.json ./

# Install packages with ignore-scripts setting active
RUN npm install

COPY . .
RUN npm run build

# Production server stage (using high-performance minimal alpine running node/nginx/etc)
FROM node:20-alpine AS production

WORKDIR /app

# Non-root user setup
USER node

COPY --from=build /app/dist ./dist
RUN npm install -g serve --ignore-scripts

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
