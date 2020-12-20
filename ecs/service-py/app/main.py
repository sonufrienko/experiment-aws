from typing import Optional
from fastapi import FastAPI

app = FastAPI()


@app.get("/py/test")
def read_test():
    return {"path": "test"}


@app.get("/py/keys")
def read_keys():
    return {"path": "keys"}
  