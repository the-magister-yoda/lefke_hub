from pydantic import BaseModel


class CategoryResponse(BaseModel):
    name: str
    slug: str

    class Config:
        from_attributes = True

    
class CategoryCreate(BaseModel):
    name: str
    slug: str


