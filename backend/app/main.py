from fastapi import FastAPI

app = FastAPI(
    title="WaveX Backend API",
    description="FastAPI Backend for WaveX",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
