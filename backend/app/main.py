from app.api.public.registration import router as registration_router
from app.api.public.login import router as login_router

from fastapi import FastAPI


app = FastAPI()

app.include_router(registration_router)
app.include_router(login_router)

@app.get("/")
def root():
    return {"status": "Poetry e FastAPI configurados!"}
