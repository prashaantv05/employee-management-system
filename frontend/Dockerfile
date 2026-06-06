# --- Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install packages
RUN npm install

# Copy application source
COPY . .

# Set environment variable for build time
ENV VITE_API_URL=/api

# Run build bundle compiling
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build outputs from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
