from pydantic import BaseModel

class DocumentOut(BaseModel):
    id: int
    filename: str
    status: str

    class Config:
        from_attributes = True