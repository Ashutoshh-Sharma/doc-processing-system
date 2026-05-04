from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import router

app = FastAPI()

# CORS CONFIG
origins = [
    "http://localhost:5173",   # local frontend
    "https://doc-processing-system-y8y1.onrender.com"  # optional
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Handle preflight requests
@app.options("/{rest_of_path:path}")
async def preflight_handler():
    return {"message": "OK"}

# Create tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(router)