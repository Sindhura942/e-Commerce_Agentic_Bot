from fastapi import APIRouter, HTTPException, Cookie
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from bson import ObjectId
import os 
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
import uuid

load_dotenv()

router = APIRouter(prefix="/api/cart", tags=["cart"])

from backend.database import products_collection as products, cart_collection as carts


def serialize_product(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    if isinstance(doc.get("images"), str):
        doc["images"] = [img.strip() for img in doc["images"].split(",") if img.strip()]
    return doc


class CartItem(BaseModel):
    product_id: str
    quantity: int = 1


class UpdateQuantity(BaseModel):
    quantity: int


def get_or_create_cart(session_id: str):
    try:
        cart = carts.find_one({"session_id": session_id})
        if not cart:
            cart = {"session_id": session_id, "items": []}
            carts.insert_one(cart)
        return cart
    except PyMongoError as e:
        print(f"❌ [DB ERROR] Cart operation failed: {e}")
        raise HTTPException(status_code=503, detail="Database error during cart retrieval.")


@router.get("/")
def get_cart(session_id: Optional[str] = Cookie(default=None)):
    if not session_id:
        return {"session_id": None, "items": [], "total": 0}

    cart = get_or_create_cart(session_id)
    enriched = []
    total = 0.0

    for item in cart.get("items", []):
        try:
            product = products.find_one({"_id": ObjectId(item["product_id"])})
        except Exception:
            continue
        if product:
            p = serialize_product(product)
            qty = item["quantity"]
            price = float(p.get("price", 0))
            enriched.append({
                "product_id": item["product_id"],
                "quantity": qty,
                "product": p,
                "subtotal": round(price * qty, 2),
            })
            total += price * qty

    return {"session_id": session_id, "items": enriched, "total": round(total, 2)}


@router.post("/add")
@router.post("/add/")
def add_to_cart(item: CartItem, session_id: Optional[str] = Cookie(default=None)):
    from fastapi.responses import JSONResponse

    if not session_id:
        session_id = str(uuid.uuid4())

    cart = get_or_create_cart(session_id)
    items = cart.get("items", [])

    # Check if already in cart
    for i, existing in enumerate(items):
        if existing["product_id"] == item.product_id:
            items[i]["quantity"] += item.quantity
            carts.update_one({"session_id": session_id}, {"$set": {"items": items}})
            response = JSONResponse({"message": "Quantity updated", "session_id": session_id})
            response.set_cookie("session_id", session_id, max_age=86400 * 7)
            return response

    # Validate product exists
    try:
        product = products.find_one({"_id": ObjectId(item.product_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    items.append({"product_id": item.product_id, "quantity": item.quantity})
    carts.update_one({"session_id": session_id}, {"$set": {"items": items}})

    response = JSONResponse({"message": "Added to cart", "session_id": session_id})
    response.set_cookie("session_id", session_id, max_age=86400 * 7)
    return response


@router.put("/{product_id}")
def update_quantity(product_id: str, body: UpdateQuantity, session_id: Optional[str] = Cookie(default=None)):
    if not session_id:
        raise HTTPException(status_code=400, detail="No session")

    cart = carts.find_one({"session_id": session_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    items = cart.get("items", [])
    for i, item in enumerate(items):
        if item["product_id"] == product_id:
            if body.quantity <= 0:
                items.pop(i)
            else:
                items[i]["quantity"] = body.quantity
            carts.update_one({"session_id": session_id}, {"$set": {"items": items}})
            return {"message": "Updated"}

    raise HTTPException(status_code=404, detail="Item not found in cart")


@router.delete("/{product_id}")
def remove_from_cart(product_id: str, session_id: Optional[str] = Cookie(default=None)):
    if not session_id:
        raise HTTPException(status_code=400, detail="No session")

    carts.update_one(
        {"session_id": session_id},
        {"$pull": {"items": {"product_id": product_id}}}
    )
    return {"message": "Removed"}


@router.delete("/")
def clear_cart(session_id: Optional[str] = Cookie(default=None)):
    if not session_id:
        raise HTTPException(status_code=400, detail="No session")
    carts.update_one({"session_id": session_id}, {"$set": {"items": []}})
    return {"message": "Cart cleared"}
