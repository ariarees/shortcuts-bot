FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm i

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Make start script executable
RUN chmod +x start.sh

# Deploy commands and run the bot
CMD ["sh", "start.sh"]