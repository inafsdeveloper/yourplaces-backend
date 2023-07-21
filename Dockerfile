# Specify the base image with Node.js
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/yourplaces-backend

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that your Express.js application listens on
EXPOSE 3000

# Set environment variables (if needed)
# ENV MONGODB_URI=mongodb+srv://inafsdeveloper:YN1XRdCbSktULKYp@cluster0.vpydxo1.mongodb.net/mern?retryWrites=true&w=majority

# Start the MongoDB service (optional: if you want to run MongoDB in the same container)
# Note: In a production setup, you should use a separate MongoDB container or an external MongoDB service
# RUN apt-get update && apt-get install -y mongodb

# Command to start the MongoDB service
# CMD ["mongod", "--bind_ip_all"]

# Command to start your Express.js application
CMD ["npm", "start"]
