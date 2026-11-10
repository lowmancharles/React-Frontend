# Stage 1: build the React app into static files (dist/)
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first so Docker can cache this layer between builds
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite bakes the API address into the JavaScript at build time.
# An environment variable takes priority over the .env.* files.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: serve the built files with nginx (no Node in the final image)
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
