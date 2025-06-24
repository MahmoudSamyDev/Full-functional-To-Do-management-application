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

ENV VITE_API_BASE_URL=http://localhost:3000/api

ENV NODE_ENV=development

# Expose port
EXPOSE 5000

# Start The application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5000"]
