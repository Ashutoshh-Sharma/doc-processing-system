import re
from collections import Counter

def extract_text(file_path):
    return "This is dummy extracted text from file."

def make_summary(text):
    return text[:100]

def get_keywords(text):
    words = re.findall(r"\w+", text.lower())
    freq = Counter(words)
    return [w for w, _ in freq.most_common(5)]