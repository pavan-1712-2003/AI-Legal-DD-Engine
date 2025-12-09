import random
from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    except Exception:
        return ""

def analyze_document(file_path, filename):
    text = extract_text_from_pdf(file_path).lower()
    
    risks = []
    category_scores = {"Legal": 0, "Financial": 0, "IP": 0, "Corporate": 0}

    # Heuristics
    if "indemnification" in text or "penalty" in text:
        risks.append({"type": "Liability", "severity": "High", "desc": "Indemnification clause found without cap."})
        category_scores["Financial"] += 20
        category_scores["Legal"] += 10

    if "patent pending" in text or "expiry" in text:
        risks.append({"type": "IP", "severity": "Medium", "desc": "Potential IP expiry or pending status detected."})
        category_scores["IP"] += 30

    if "court" in text or "arbitration" in text or "dispute" in text:
        risks.append({"type": "Litigation", "severity": "Critical", "desc": "Active dispute or arbitration reference found."})
        category_scores["Legal"] += 40

    if not text:
        risks.append({"type": "Format", "severity": "Low", "desc": "Document is scanned/image-based. OCR required."})

    total_risk_score = min(sum(category_scores.values()), 100)
    
    return {
        "filename": filename,
        "risk_score": total_risk_score,
        "category_breakdown": category_scores,
        "flags": risks
    }
