"""
FastAPI Main Application Entrypoint for AURA AI Services
"""

from fastapi import FastAPI
from aiml.ai_digest.router import router as digest_router

app = FastAPI(
    title="AURA AI Services",
    version="0.1.0",
    description="NLP, Daily AI Digest, and Prioritization API"
)

# Exception 5a: Single router registration line
app.include_router(digest_router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "aura-ai-services"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
