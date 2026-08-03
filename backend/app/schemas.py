from typing import List, Optional

from pydantic import BaseModel, Field


class UserRegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=120)
    first_name: str = Field(..., min_length=1, max_length=120)
    last_name: str = Field(..., min_length=1, max_length=120)
    district: str = Field(..., min_length=1, max_length=120)
    admin_status: int = Field(default=0, ge=0, le=1)
    password: str = Field(..., min_length=4, max_length=255)


class UserResponse(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    district: str
    admin_status: int
    is_active: bool

    class Config:
        from_attributes = True


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class UserLoginRequest(BaseModel):
    username: str
    password: str


class QuestionCreateRequest(BaseModel):
    category: str
    question_text: str
    correct_answer: str
    options: List[str]
    difficulty_level: int = Field(default=1, ge=1, le=5)


class QuestionResponse(BaseModel):
    id: int
    category: str
    question_text: str
    correct_answer: str
    options: List[str]
    difficulty_level: int
    is_active: bool

    class Config:
        from_attributes = True


class QuestionUpdateRequest(BaseModel):
    category: Optional[str] = None
    question_text: Optional[str] = None
    correct_answer: Optional[str] = None
    options: Optional[List[str]] = None
    difficulty_level: Optional[int] = Field(default=None, ge=1, le=5)
    is_active: Optional[bool] = None
