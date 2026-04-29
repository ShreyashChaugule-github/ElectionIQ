FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the frontend (Vite output goes to /dist)
RUN npm run build

# Expose Cloud Run default port
EXPOSE 8080

# Set the port environment variable
ENV PORT=8080

# Start the Express server
CMD ["npm", "run", "server"]
