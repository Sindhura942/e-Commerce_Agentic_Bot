from fastapi import APIRouter, HTTPException, Query
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
from typing import Optional

load_dotenv()

router = APIRouter(prefix="/api/products", tags=["products"])

from backend.database import products_collection as collection


def serialize(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    # Normalize images into a list
    if isinstance(doc.get("images"), str):
        doc["images"] = [img.strip() for img in doc["images"].split(",") if img.strip()]
    # Normalize image_file into a list
    if isinstance(doc.get("image_file"), str):
        doc["image_files"] = [f.strip() for f in doc["image_file"].split("|") if f.strip()]
    return doc


@router.get("/")
def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    brand: Optional[str] = None,
    gender: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
):
    query = {}

    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}
    if gender:
        query["gender"] = {"$regex": gender, "$options": "i"}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    if min_price or max_price:
        query["price"] = {}
        if min_price:
            query["price"]["$gte"] = str(min_price)
        if max_price:
            query["price"]["$lte"] = str(max_price)

    total = collection.count_documents(query)
    skip = (page - 1) * limit
    products = list(collection.find(query).skip(skip).limit(limit))

    return {
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
        "products": [serialize(p) for p in products],
    }


@router.get("/{product_id}")
def get_product(product_id: str):
    try:
        doc = collection.find_one({"_id": ObjectId(product_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize(doc)


@router.get("/brands/all")
def get_brands():
    brands = collection.distinct("brand")
    return sorted([b for b in brands if b])


@router.get("/genders/all")
def get_genders():
    genders = collection.distinct("gender")
    return sorted([g for g in genders if g])