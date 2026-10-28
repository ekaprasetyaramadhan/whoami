# ==========================================
# KARTIKA COG-SHIELD - Dockerfile Multi-Stage
# PUSSIBERAD TNI AD - Cognitive Warfare Defense
# ==========================================

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime Backend & Unified Static Serving
FROM python:3.11-slim AS runtime
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Install dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend application
COPY backend/ ./backend/

# Copy compiled frontend from Stage 1 into backend static
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request, os; port = os.environ.get('PORT', '8000'); urllib.request.urlopen(f'http://localhost:{port}/api/v1/ews/telemetry')" || exit 1

# Start FastAPI application
CMD ["python", "backend/run.py"]
