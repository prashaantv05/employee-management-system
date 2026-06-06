# Use Node.js LTS light alpine image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package configurations
COPY package*.json ./

# Install packages
RUN npm install --only=production

# Copy application source
COPY . .

# Expose API port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
