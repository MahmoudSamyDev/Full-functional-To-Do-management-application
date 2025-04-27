# Stage 0:Base
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --production

# Copy application files
COPY . .

# Expose port (default to 5000, configurable via .env)
EXPOSE 5000

# Set environment variables (defaults, override with .env or Docker)
ENV PORT=5000
ENV MONGODB_URI=mongodb://admin:admin@localhost:27017/todos-app?authSource=admin
ENV PASSWORD_SECRET_KEY=mahmoud@123
ENV TOKEN_SECRET_KEY=mahmoud@123
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]