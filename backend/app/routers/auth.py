from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str
    rememberMe: bool = True


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    confirmPassword: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    password: str
    confirmPassword: str


@router.post("/auth/login")
def login(data: LoginRequest):
    return {
        "session": {
            "email": data.email,
            "name": "Kushal Verma",
            "provider": "email"
        }
    }


@router.post("/auth/signup")
def signup(data: SignupRequest):
    return {
        "session": {
            "email": data.email,
            "name": data.name,
            "provider": "email"
        }
    }


@router.post("/auth/logout")
def logout():
    return {"ok": True}


@router.post("/auth/forgot-password")
def forgot_password(data: ForgotPasswordRequest):
    return {
        "message": "Password reset link sent.",
        "email": data.email,
    }


@router.post("/auth/reset-password")
def reset_password(data: ResetPasswordRequest):
    return {
        "message": "Password updated successfully."
    }


@router.get("/auth/session")
def session():
    return {
        "session": {
            "email": "kushal@example.com",
            "name": "Kushal Verma",
            "provider": "email",
        }
    }