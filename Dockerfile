FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm ci --prod
COPY . .
RUN pnpm run build:widget
EXPOSE 3000
USER node
CMD ["node", "src/server.js"]