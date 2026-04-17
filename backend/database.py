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
    raise ValueError("MONGO_URI not found in .env file")

# Initialize MongoDB client and database
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Test the connection
    client.admin.command('ping')
    print("✓ Connected to MongoDB successfully")
except ServerSelectionTimeoutError:
    print("✗ Failed to connect to MongoDB")
    raise

db = client["ecommerce_db"]

# Collections
users_collection = db["users"]
products_collection = db["products"]
orders_collection = db["orders"]
cart_collection = db["cart"]