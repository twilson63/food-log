# Use Node.js LTS
FROM node:20-slim

# Install better-sqlite3 dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY src ./src

# Create data directory for SQLite
RUN mkdir -p /app/data

# Environment
ENV NODE_ENV=production
ENV PORT=3001
ENV DATA_DIR=/app/data

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "src/index.js"]