# Use Node.js 20 as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema files and generate the Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 3000 

# Explicitly set DATABASE_URL during migration and start the application
# To wipe the database and seed it freshly, use:
# CMD ["sh", "-c", "npx prisma migrate reset --force && npm run dev"]

# To deploy the migrations and start the application, use:
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]