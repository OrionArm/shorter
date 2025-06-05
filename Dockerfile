# -------------------- Base --------------------
FROM node:24.2.0 AS base
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm install

# -------------------- Dev для backend --------------------
FROM base AS backend-dev
WORKDIR /app/backend
COPY backend ./backend
CMD ["sh", "./start-dev.sh"]

# -------------------- Prod для backend --------------------
FROM base AS backend-prod
WORKDIR /app/backend
COPY backend .
WORKDIR /app
RUN npm run build -w=backend
CMD ["sh", "./backend/start.sh"]

# -------------------- Dev для frontend --------------------
FROM base AS frontend
WORKDIR /app/frontend
COPY frontend ./frontend
CMD ["npm", "run", "dev"]

# -------------------- Prod для frontend (vite build + nginx) --------------------
FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend .
WORKDIR /app
RUN npm run build -w=frontend

# Финальный nginx образ
FROM nginx:alpine AS frontend-prod
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
