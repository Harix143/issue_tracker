# Stage 1: build the React app
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy package.json & install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of your React source & build
COPY frontend/ ./
RUN npm run build

# Stage 2: build the Django app
FROM python:3.11-slim
WORKDIR /app

# Install Python deps + WhiteNoise + Gunicorn
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt whitenoise gunicorn

# Copy backend code
COPY backend/ ./

# Bring in the React build output
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# Collect static files into STATIC_ROOT
RUN python manage.py collectstatic --noinput

# Expose & run
EXPOSE 8000
CMD ["gunicorn", "tracker.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
