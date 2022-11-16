# Dockerfile

# Use node alpine as it's a small node image
FROM node:alpine

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}


# Create the directory on the node image 
# where our Next.js app will live
RUN mkdir -p /admin

# Set /app as the working directory
WORKDIR /admin

# Copy package.json and package-lock.json
# to the /app working directory
COPY ./admin/package*.json ./

# Install dependencies in /app
RUN npm install

# Copy the rest of our Next.js folder into /app
COPY ./admin ./

# Ensure port 3002 is accessible to our system
EXPOSE 3002

# Run npm dev, as we would via the command line 
CMD ["npm", "run", "dev"]