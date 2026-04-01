from app.routes.registration import router as registration_router

from fastapi import FastAPI


app = FastAPI()

app.include_router(registration_router)


@app.get("/")
def root():
    return {"status": "Poetry e FastAPI configurados!"}
