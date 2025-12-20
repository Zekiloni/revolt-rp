FROM node:lts-alpine

# Set working directory inside container
WORKDIR /app

# Copy built server and browser bundles from Nx dist folder
COPY dist/packages/web-ui ./

# Expose your app’s port
EXPOSE 4000

# Start the Node.js server
CMD ["node", "server/server.mjs"]
