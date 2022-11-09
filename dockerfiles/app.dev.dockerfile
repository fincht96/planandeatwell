# Dockerfile

# Use node alpine as it's a small node image
FROM node:alpine


ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

ARG NEXT_PUBLIC_GA_TRACKING_ID
ENV NEXT_PUBLIC_GA_TRACKING_ID=${NEXT_PUBLIC_GA_TRACKING_ID}

ARG NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}

# Create the directory on the node image 
# where our Next.js app will live
RUN mkdir -p /app

# Set /app as the working directory
WORKDIR /app

# Copy package.json and package-lock.json
# to the /app working directory
COPY ./app/package*.json ./

# Install dependencies in /app
RUN npm install

# Copy the rest of our Next.js folder into /app
COPY ./app ./

# Ensure port 3000 is accessible to our system
EXPOSE 3001

# Run npm dev, as we would via the command line 
CMD ["npm", "run", "dev"]