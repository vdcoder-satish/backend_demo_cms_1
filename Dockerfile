# Use AWS Lambda base image for Node.js 20
FROM public.ecr.aws/lambda/nodejs:20

# Set the working directory inside the container
WORKDIR /var/task

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# Command for AWS Lambda to invoke the function
CMD ["app.handler"]
