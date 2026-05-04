import json
from .database import SessionLocal
from .models import Document
from .services import extract_text, make_summary, get_keywords

def process_document(doc_id):
    db = SessionLocal()
    doc = db.query(Document).get(doc_id)

    text = extract_text(doc.file_path)
    summary = make_summary(text)
    keywords = get_keywords(text)

    result = {
        "title": doc.filename,
        "summary": summary,
        "keywords": keywords
    }import json
from .database import SessionLocal
from .models import Document
from .services import extract_text, make_summary, get_keywords

def process_document(doc_id):
    db = SessionLocal()

    try:
        doc = db.query(Document).get(doc_id)

        text = extract_text(doc.file_path)
        summary = make_summary(text)
        keywords = get_keywords(text)

        result = {
            "title": doc.filename,
            "summary": summary,
            "keywords": keywords
        }

        doc.result = json.dumps(result)
        doc.status = "completed"

        db.commit()

    except Exception as e:
        print("PROCESS ERROR:", e)

    finally:
        db.close()

    doc.result = json.dumps(result)
    doc.status = "completed"

    db.commit()
    db.close()