"""
Pydantic models for data validation and serialization.
"""    

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from enum import Enum

# Type hinting

class Product(BaseModel):
    """Product model for the store inventory."""
    name: str
    description: str
    price: int
    category: str
    size: List[str]  # s, m, l, xl
    color: List[str]  # red, blue, green, yellow, black, white, purple, pink, orange, brown, gray, etc.
    image: str  # url of picsum photos 


class User(BaseModel):
    """User registration and login model."""
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str
    
    @validator('password')
    def password_strength(cls, v):
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        return v


class LoginRequest(BaseModel):
    """User login model."""
    email: EmailStr
    password: str


class Address(BaseModel):
    """Shipping/Billing address model."""
    street: str
    city: str
    state: str
    postal_code: str = Field(..., min_length=5)
    country: str
    phone: str = Field(..., min_length=10)


class PaymentDetails(BaseModel):
    """Payment card details model."""
    card_number: str = Field(..., min_length=13, max_length=19)
    cardholder_name: str
    expiry_month: int = Field(..., ge=1, le=12)
    expiry_year: int = Field(..., ge=2026)
    cvv: str = Field(..., min_length=3, max_length=4)
    
    @validator('card_number')
    def validate_card_number(cls, v):
        # Remove spaces and check if it's numeric
        clean = v.replace(' ', '')
        if not clean.isdigit():
            raise ValueError('Card number must contain only digits')
        return clean


class Order(BaseModel):
    """Order placement model."""
    user_email: EmailStr
    product_name: str
    quantity: int
    shipping_address: Address
    payment_details: PaymentDetails


class CartItem(BaseModel):
    """Shopping cart item model."""
    user_email: EmailStr
    product_name: str
    quantity: int
    price: float