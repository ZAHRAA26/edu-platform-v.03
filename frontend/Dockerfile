# Use a Node.js base image
FROM node:22.20.0-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend application
COPY . ./

# Build the React app
RUN npm run build
RUN ls -l dist

# Install curl for health checks
RUN apk add --no-cache curl

# Serve the app with Vite preview (better for development)
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
