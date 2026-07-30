FROM node:26-alpine AS build

WORKDIR /app

# Copy hardening config and project definition files
COPY .npmrc package.json package-lock.json* tsconfig.json ./

# Install exact locked dependencies with ignore-scripts setting active
RUN npm ci --ignore-scripts

# Accept VITE_API_URL build argument for Vite bundle compilation
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Production server stage
FROM node:26-alpine AS production

WORKDIR /app

# Copy lockfile and package manifest
COPY .npmrc package.json package-lock.json* ./

# Copy built dist files
COPY --from=build /app/dist ./dist

# Install ONLY production dependencies strictly with ignore-scripts
RUN npm ci --omit=dev --ignore-scripts

USER node

EXPOSE 3000

CMD ["./node_modules/.bin/serve", "-s", "dist", "-l", "3000"]
