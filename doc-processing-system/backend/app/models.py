from sqlalchemy import Column, Integer, String, Text, Boolean
from .database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)
    filename = Column(String)
    file_path = Column(String)
    status = Column(String, default="queued")
    result = Column(Text)
    is_final = Column(Boolean, default=False)