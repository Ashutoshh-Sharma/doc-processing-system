from fastapi import APIRouter, UploadFile, File
import os, shutil, uuid

from .database import SessionLocal
from .models import Document
from .tasks import process_document

router = APIRouter()

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    db = SessionLocal()

    try:
        UPLOAD_DIR = "/tmp/uploads"
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        file_path = os.path.join(
            UPLOAD_DIR,
            f"{uuid.uuid4()}_{file.filename}"
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        doc = Document(
            filename=file.filename,
            file_path=file_path,
            status="processing"
        )

        db.add(doc)
        db.commit()
        db.refresh(doc)

        # direct processing (no celery)
        process_document(doc.id)

        return {"doc_id": doc.id}

    except Exception as e:
        print("UPLOAD ERROR:", e)
        return {"error": str(e)}

    finally:
        db.close()


@router.get("/status/{doc_id}")
def status(doc_id: int):
    db = SessionLocal()
    doc = db.query(Document).get(doc_id)

    data = {
        "status": doc.status,
        "result": doc.result
    }

    db.close()
    return data


@router.get("/documents")
def documents():
    db = SessionLocal()
    docs = db.query(Document).all()
    db.close()
    return docs