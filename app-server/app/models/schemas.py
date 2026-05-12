from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import Optional, List
from datetime import datetime, date

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "doador"
    phone: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    cep: Optional[str] = None
    street: Optional[str] = None
    number: Optional[str] = None
    complement: Optional[str] = None
    neighborhood: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str
    birth_date: date

    @field_validator('birth_date')
    @classmethod
    def validate_age(cls, v):
        today = date.today()
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 18:
            raise ValueError('Você deve ter pelo menos 18 anos para se cadastrar.')
        return v

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    cep: Optional[str] = None
    street: Optional[str] = None
    number: Optional[str] = None
    complement: Optional[str] = None
    neighborhood: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    avatar_url: Optional[str] = None

class User(UserBase):
    id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

class OngBase(BaseModel):
    organization_name: str
    description: Optional[str] = None
    cnpj: str
    cep: str
    street: str
    number: str
    complement: Optional[str] = None
    neighborhood: str
    city: str
    state: str
    full_address: Optional[str] = None
    phone: str
    website: Optional[str] = None
    social_media: Optional[str] = None
    latitude: float
    longitude: float
    logo_url: Optional[str] = None

class OngCreate(OngBase):
    user_id: str

class Ong(OngBase):
    id: int
    user_id: str
    verified: bool = False

    model_config = ConfigDict(from_attributes=True)

class HelpRequestBase(BaseModel):
    title: str
    description: str
    category: str = "Alimentos"
    urgency: str = "media"
    status: str = "ABERTO"
    quantity: Optional[int] = None
    unit: Optional[str] = None
    delivery_location: str
    latitude: float
    longitude: float
    image_url: Optional[str] = None

class HelpRequestCreate(HelpRequestBase):
    ong_id: int

class HelpRequest(HelpRequestBase):
    id: int
    ong_id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class InterestBase(BaseModel):
    request_id: int
    message: Optional[str] = None
    photo_url: Optional[str] = None

class InterestCreate(InterestBase):
    user_id: str

class Interest(InterestBase):
    id: int
    user_id: str
    status: str = "Pendente"
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
