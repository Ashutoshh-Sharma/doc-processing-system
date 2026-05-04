from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
import redis
import os
import shutil

from .database import SessionLocal
from .models import Document
from .tasks import process_document

router = APIRouter()

# Redis
r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ✅ UPLOAD ROUTE (IMPORTANT)
@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    db = SessionLocal()

    # save file
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # create db entry
    doc = Document(
        filename=file.filename,
        file_path=file_path,
        status="queued"
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    # trigger celery task
    # process_document.delay(doc.id)
    process_document(doc.id)

    db.close()

    return {"doc_id": doc.id}


# ✅ GET ALL DOCUMENTS
@router.get("/documents")
def list_documents():
    db = SessionLocal()
    docs = db.query(Document).all()
    db.close()
    return docs


# ✅ STATUS API
@router.get("/status/{doc_id}")
def status(doc_id: int):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()

    data = {
        "status": doc.status,
        "result": doc.result
    }

    db.close()
    return data


# ✅ RETRY
@router.post("/retry/{doc_id}")
def retry(doc_id: int):
    process_document.delay(doc_id)
    return {"msg": "retry started"}


# ✅ FINALIZE
@router.post("/finalize/{doc_id}")
def finalize(doc_id: int):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()

    doc.is_final = True
    db.commit()

    db.close()
    return {"msg": "finalized"}


# ✅ STREAM (SSE)
@router.get("/stream/{doc_id}")
def stream(doc_id: int):
    pubsub = r.pubsub()
    pubsub.subscribe(f"doc_{doc_id}")

    def event_stream():
        for message in pubsub.listen():
            if message["type"] == "message":
                yield f"data: {message['data']}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# ✅ LOGS (IMPORTANT FIX)
@router.get("/logs/{doc_id}")
def get_logs(doc_id: int):
    logs = r.lrange(f"doc_logs_{doc_id}", 0, -1)
    return logs