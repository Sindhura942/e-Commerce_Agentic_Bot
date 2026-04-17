import json
import os
from database import db, products_collection

DATA_FOLDER = os.path.join(os.path.dirname(__file__), "..", "data")

def load_json_file(filename):
    """Load JSON data from file"""
    filepath = os.path.join(DATA_FOLDER, filename)
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"File not found: {filepath}")
        return None

def load_data_to_mongodb():
    """Load product data from farfetch_dataset.json into MongoDB"""
    
    # Load products from farfetch_dataset.json
    products_data = load_json_file("farfetch_dataset.json")
    if products_data:
        # Clear existing data (optional)
        products_collection.delete_many({})
        
        # Insert new data
        result = products_collection.insert_many(products_data)
        print(f"✓ Loaded {len(result.inserted_ids)} products into MongoDB")
    else:
        print("✗ No data loaded")

if __name__ == "__main__":
    load_data_to_mongodb()
    print("Data loading complete!")