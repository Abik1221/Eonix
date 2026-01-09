from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    name: str
    age: int

@app.get("/users")
def get_users():
    pass

@app.post("/users")
def create_user(user: User):
    pass
