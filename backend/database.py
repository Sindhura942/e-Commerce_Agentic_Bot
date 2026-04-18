"""
Database configuration and MongoDB connection setup.
"""
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from dotenv import load_dotenv
import os   

# Load environment variables from .env file at root
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=dotenv_path)

# Get MongoDB connection string from environment
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    # Fallback to .env for local development
    dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(dotenv_path):
        load_dotenv(dotenv_path=dotenv_path)
        MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    print("⚠️ WARNING: MONGO_URI not found. Database operations will fail.")

# Initialize MongoDB client (Connection is lazy, no blocking ping)
client = MongoClient(MONGO_URI or "mongodb://localhost:27017", serverSelectionTimeoutMS=5000)

db = client["ecommerce_db"]

# Collections
users_collection = db["users"]
products_collection = db["products"]
orders_collection = db["orders"]
cart_collection = db["cart"]