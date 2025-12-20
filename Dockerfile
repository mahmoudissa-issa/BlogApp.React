# 1. Use Node.js
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy dependency files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the app
COPY . .

# 6. Expose Vite port
EXPOSE 5173

# 7. Start dev server
CMD ["npm", "run", "dev", "--", "--host"]
