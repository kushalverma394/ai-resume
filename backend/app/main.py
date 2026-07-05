from fastapi import FastAPI

app = FastAPI(title="AI Resume Analyzer API")

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}