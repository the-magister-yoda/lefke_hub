import enum

from sqlalchemy import Column, Integer, Numeric, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class UserRole(enum.Enum):
    USER = "user"
    ADMIN = "admin"


class Status(enum.Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    status = Column(Enum(Status), nullable=False, default=Status.ACTIVE)

    ads = relationship("Ad", back_populates='category')

    
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    phone_number = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)
    created_at = Column(DateTime, default=func.now())
    status = Column(Enum(Status), nullable=False, default=Status.ACTIVE)

    ads = relationship("Ad", back_populates="user")


class Ad(Base):
    __tablename__ = "ads"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Numeric(7, 2), nullable=False)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=func.now())
    status = Column(Enum(Status), nullable=False, default=Status.ACTIVE)
    views = Column(Integer, default=0)

    user = relationship("User", back_populates="ads")
    images = relationship("AdImage", back_populates="ad", cascade="all, delete-orphan")
    category = relationship("Category", back_populates="ads")


class AdImage(Base):
    __tablename__ = "ad_images"

    id = Column(Integer, primary_key=True, index=True)

    ad_id = Column(Integer, ForeignKey("ads.id"), nullable=False)

    url = Column(String, nullable=False)

    ad = relationship("Ad", back_populates="images")


