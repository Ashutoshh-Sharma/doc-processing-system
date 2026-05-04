import time
import json
import redis

# from .celery_worker import celery
from .database import SessionLocal
from .models import Document
from .services import extract_text, make_summary, get_keywords

r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

def send(doc_id, event):
    data = json.dumps(event)
    r.publish(f"doc_{doc_id}", data)          # live
    r.rpush(f"doc_logs_{doc_id}", data)       # history


# @celery.task(name="app.tasks.process_document")
def process_document(doc_id):
    db = SessionLocal()
    doc = db.query(Document).get(doc_id)
    if not doc:
        return

    try:
        doc.status = "processing"
        db.commit()

        send(doc_id, {"event": "job_started"})
        time.sleep(0.5)

        send(doc_id, {"event": "parsing_started"})
        text = extract_text(doc.file_path)
        time.sleep(0.5)
        send(doc_id, {"event": "parsing_done"})

        send(doc_id, {"event": "extraction_started"})
        summary = make_summary(text)
        keywords = get_keywords(text, k=5)
        time.sleep(0.5)
        send(doc_id, {"event": "extraction_done"})

        result = {
            "title": doc.filename,
            "summary": summary,
            "keywords": keywords
        }

        doc.result = json.dumps(result)
        doc.status = "completed"
        db.commit()

        send(doc_id, {"event": "job_completed"})

    except Exception:
        doc.status = "failed"
        db.commit()
        send(doc_id, {"event": "job_failed"})

    finally:
        db.close()