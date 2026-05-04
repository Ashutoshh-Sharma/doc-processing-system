import re
from collections import Counter

# --- TEXT EXTRACTORS ---

def extract_text_from_pdf(path):
    text = ""
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(path)
        for p in reader.pages:
            text += (p.extract_text() or "") + "\n"
    except Exception:
        pass
    return text


def extract_text_from_image(path):
    text = ""
    try:
        import pytesseract
        from PIL import Image
        img = Image.open(path)
        text = pytesseract.image_to_string(img)
    except Exception:
        pass
    return text


def extract_text(file_path):
    file_path = file_path.lower()
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    if file_path.endswith((".png", ".jpg", ".jpeg")):
        return extract_text_from_image(file_path)
    return ""


# --- SIMPLE NLP (no heavy libs) ---

STOPWORDS = set("""
a an the is are was were be been being and or of to in on for with as by from at
this that these those it its your you we they i he she them our their
""".split())

def clean_words(text):
    words = re.findall(r"[a-zA-Z]{3,}", text.lower())
    return [w for w in words if w not in STOPWORDS]


def make_summary(text):
    if not text.strip():
        return "No readable content found in file."
    # naive: first ~2–3 sentences or first 300 chars
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    summary = " ".join(sentences[:2]).strip()
    return summary[:300]


def get_keywords(text, k=5):
    words = clean_words(text)
    if not words:
        return []
    freq = Counter(words)
    return [w for w, _ in freq.most_common(k)]