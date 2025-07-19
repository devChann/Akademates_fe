# Dockerfile

# Use an existing node alpine image as a base image.
FROM node:18-alpine

# Set the working directory.
WORKDIR /app

# Copy package.json and yarn.lock for cache efficiency.
COPY package.json yarn.lock ./

# Install application dependencies with Yarn.
RUN yarn install --frozen-lockfile

# Copy the rest of the application files.
COPY . .

# Default port for the app; can be overridden at runtime via -e PORT=####
ENV PORT 3001

# Expose the port the app runs on.
EXPOSE 3001

# Start the application, using the PORT env variable.
CMD ["sh", "-c", "yarn start"]
