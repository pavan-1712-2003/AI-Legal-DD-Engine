from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from typing import List
from analysis_engine import analyze_document

app = FastAPI()

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"status": "AI Due Diligence Engine Ready"}

@app.post("/analyze")
async def analyze_files(files: List[UploadFile] = File(...)):
    results = []
    
    # Process each uploaded file
    for file in files:
        file_location = f"{UPLOAD_DIR}/{file.filename}"
        
        # Save to temp storage
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        # Run AI Analysis
        analysis = analyze_document(file_location, file.filename)
        results.append(analysis)
        
        # Cleanup - COMMENTED OUT TO KEEP FILES FOR PERSISTENCE/AUDIT
        # os.remove(file_location) 

    # Aggregate Data for Dashboard
    total_risk = 0
    heatmap_data = {"Legal": 0, "Financial": 0, "IP": 0, "Corporate": 0}
    
    for res in results:
        total_risk += res['risk_score']
        for cat, score in res['category_breakdown'].items():
            heatmap_data[cat] += score

    avg_risk_index = total_risk / len(results) if results else 0

    return {
        "summary": {
            "total_files": len(results),
            "acquisition_risk_index": round(avg_risk_index, 2),
            "heatmap": heatmap_data
        },
        "detailed_reports": results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)