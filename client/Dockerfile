# Stage 1: Build
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Set environment variable for building
ARG BASE_URL=http://localhost:5000/api

ENV VITE_API_BASE_URL=http://localhost:5000/api

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (optional, see below)
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENV BACKEND_URL=http://localhost:5000/api

# Expose port
EXPOSE 80


# Start Nginx
CMD ["nginx", "-g", "daemon off;"]