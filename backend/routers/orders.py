from fastapi import APIRouter, HTTPException, Cookie
from pymongo import MongoClient
from bson import ObjectId
import os 
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

load_dotenv()

router = APIRouter(prefix="/api/orders", tags=["orders"])

client = MongoClient(os.getenv("MONGO_URI"))
db = client["ecommerce_db"]
orders = db["orders"]
carts = db["carts"]
products_col = db["products"]


class Address(BaseModel):
    full_name: str
    email: str
    address: str
    city: str
    zip_code: str
    country: str


class CheckoutRequest(BaseModel):
    shipping: Address


def serialize_order(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


@router.post("/checkout")
@router.post("/checkout/")
def checkout(body: CheckoutRequest, session_id: Optional[str] = Cookie(default=None)):
    if not session_id:
        raise HTTPException(status_code=400, detail="No cart session found")

    cart = carts.find_one({"session_id": session_id})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Build order items with product snapshots
    order_items = []
    total = 0.0

    for item in cart["items"]:
        try:
            product = products_col.find_one({"_id": ObjectId(item["product_id"])})
        except Exception:
            continue
        if product:
            price = float(product.get("price", 0))
            qty = item["quantity"]
            images = product.get("images", "")
            if isinstance(images, str):
                images = [img.strip() for img in images.split(",") if img.strip()]

            order_items.append({
                "product_id": item["product_id"],
                "title": product.get("title"),
                "brand": product.get("brand"),
                "price": price,
                "quantity": qty,
                "subtotal": round(price * qty, 2),
                "image": images[0] if images else None,
            })
            total += price * qty

    if not order_items:
        raise HTTPException(status_code=400, detail="No valid products in cart")

    order_id = str(uuid.uuid4())[:8].upper()

    order_doc = {
        "order_id": order_id,
        "session_id": session_id,
        "items": order_items,
        "total": round(total, 2),
        "shipping": body.shipping.dict(),
        "status": "confirmed",
        "created_at": datetime.utcnow().isoformat(),
    }

    orders.insert_one(order_doc)

    # Clear cart after order
    carts.update_one({"session_id": session_id}, {"$set": {"items": []}})

    return {
        "message": "Order placed successfully",
        "order_id": order_id,
        "total": round(total, 2),
        "status": "confirmed",
    }


@router.get("/")
def get_orders(session_id: Optional[str] = Cookie(default=None)):
    if not session_id:
        return []
    all_orders = list(orders.find({"session_id": session_id}))
    return [serialize_order(o) for o in all_orders]


@router.get("/{order_id}")
def get_order(order_id: str, session_id: Optional[str] = Cookie(default=None)):
    order = orders.find_one({"order_id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize_order(order)