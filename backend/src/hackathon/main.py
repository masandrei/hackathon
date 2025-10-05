from fastapi import FastAPI, Depends
import uvicorn
import aiosqlite

app = FastAPI(title="Hackathon API")


# Dependency for getting a database connection
async def get_db():
    db = await aiosqlite.connect("hackathon.db")
    try:
        yield db
    finally:
        await db.close()


# Basic endpoint to fetch all rows from a sample table using DI
@app.get("/db-items")
async def get_db_items(db=Depends(get_db)):
    cursor = await db.execute("SELECT id, name FROM items")
    rows = await cursor.fetchall()
    await cursor.close()
    return [{"id": row[0], "name": row[1]} for row in rows]

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

def main():
    uvicorn.run("hackathon.main:app", host="127.0.0.1", port=8080, reload=True, app_dir="src")
