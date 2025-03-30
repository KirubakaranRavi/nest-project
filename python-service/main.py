from fastapi import FastAPI, HTTPException
import subprocess
import json
from pydantic import BaseModel

app = FastAPI()

# In-memory storage for tracking ingestion status
ingestion_status = {}

class IngestionRequest(BaseModel):
    filename: str
    path: str

@app.post("/trigger-ingestion")
async def trigger_ingestion(request: IngestionRequest):
    try:
        filename = request.filename
        path = request.path

        ingestion_status[filename] = "Ingestion Started"

        # ✅ Fix: Pass JSON data as separate arguments
        subprocess.Popen(["python", "ingest.py", json.dumps({"filename": filename, "path": path})])

        return {"message": "Ingestion process started", "filename": filename}
    except Exception as e:
        ingestion_status[filename] = "Failed"
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/ingestion-status/{filename}")
async def get_ingestion_status(filename: str):
    return {"filename": filename, "status": ingestion_status.get(filename, "Not Found")}
