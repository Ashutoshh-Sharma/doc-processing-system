import re
from collections import Counter

def extract_text(file_path):
    # dummy extractor (safe for deploy)
    return "This is extracted text from file."

def make_summary(text):
    return text[:120]

def get_keywords(text):
    words = re.findall(r"\w+", text.lower())
    freq = Counter(words)
    return [w for w, _ in freq.most_common(5)]