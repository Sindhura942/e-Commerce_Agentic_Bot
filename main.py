from fastapi import FastAPI

from backend.routers import products, orders, cart, chatbot
import os
import uvicorn
import logfire
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

print("🚀 [STARTUP] Initializing FastAPI...")

# Initialize FastAPI app
app = FastAPI()


# Configure Logfire for Observability
logfire.configure(send_to_logfire='if-token-present')
logfire.instrument_fastapi(app)
logfire.instrument_pydantic()

# Create uploads folder for product images
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    

# Include API route modules
print("📦 [STARTUP] Including routers...")
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(cart.router)
app.include_router(chatbot.router)
print("✅ [STARTUP] Routers included.")

# Serve uploaded files statically
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    print(f"📁 [STARTUP] Creating missing folder: {UPLOAD_FOLDER}")
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    from fastapi import Response
    return Response(status_code=204)

# Serve Frontend natively
FRONTEND_DIR = "frontend"
if os.path.exists(FRONTEND_DIR):
    print(f"🌐 [STARTUP] Mounting frontend from: {FRONTEND_DIR}")
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
else:
    print(f"⚠️ [STARTUP] WARNING: Frontend directory '{FRONTEND_DIR}' not found. Serving as API-only.")

print("🏁 [STARTUP] Application setup complete.")

if __name__ == "__main__":
    print("⚙️ Starting backend server (FastAPI)...")
    uvicorn.run(app, host="0.0.0.0", port=8080)