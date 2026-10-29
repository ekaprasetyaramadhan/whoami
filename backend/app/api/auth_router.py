"""
REST API Router for Authentication (Login, Me, Logout)
Platform KOMANDO
"""

from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.core.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    status: str
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    user = auth_service.authenticate(req.username, req.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username atau password yang Anda masukkan salah."
        )

    token = auth_service.create_session(user["id"])
    return {
        "status": "success",
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me")
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Header otentikasi Bearer token tidak ditemukan."
        )

    user = auth_service.get_user_by_token(authorization)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesi login tidak valid atau telah kedaluwarsa."
        )

    return {
        "status": "success",
        "user": user
    }

@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    if authorization:
        auth_service.logout(authorization)
    return {
        "status": "success",
        "message": "Sesi berhasil ditutup."
    }
