from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Hackathon API")

@app.get("/")
def root():
    return {"message": "Hello from Hackathon!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


def main():
    uvicorn.run("hackathon.main:app", host="127.0.0.1", port=8000, reload=True, app_dir="src")
