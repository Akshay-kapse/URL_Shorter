FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build Next.js project
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Start the Next.js app properly
CMD ["npm", "start"]
