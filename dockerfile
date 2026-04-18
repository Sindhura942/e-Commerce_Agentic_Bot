# Build the Application
FROM python:3.11-slim
WORKDIR /app
  
# Install backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code (Backend + Frontend natively)
COPY . .

# Environment variables
ENV PYTHONUNBUFFERED=1

# Expose the application port
EXPOSE 8080

# Start the application using the dynamic PORT environment variable (defaults to 8080)
CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]