# Stage 0:Base
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .


# Set environment variables (defaults, override with .env or Docker)
ENV PORT=3000
ENV MONGODB_URI=mongodb://admin:admin@localhost:27017/todos-app?authSource=admin
ENV PASSWORD_SECRET_KEY=mahmoud@123
ENV TOKEN_SECRET_KEY=mahmoud@123
ENV JWT_SECRET=your_jwt_secret_key
ENV NODE_ENV=production

# Expose port (default to 3000, configurable via .env)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]