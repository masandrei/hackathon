from pydantic import BaseModel

# TODO: Define request and response schemas here
class Item(BaseModel):
    id: int
    name: str