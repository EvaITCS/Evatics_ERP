# --- Build stage ---
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY public ./public
COPY src ./src

# CRA inlines REACT_APP_* vars into the bundle at build time, so this must be
# a build arg (not a runtime env var) to take effect.
ARG REACT_APP_BACKEND_API_URL
ENV REACT_APP_BACKEND_API_URL=${REACT_APP_BACKEND_API_URL}

RUN npm run build

# --- Run stage ---
FROM nginx:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]