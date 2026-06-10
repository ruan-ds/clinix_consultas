from app.api.public.registration import router as registration_router
from app.api.public.login import router as login_router
from app.api.public.patient import router as patient_router
from app.api.clinix.clinic import router as clinic_router

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(registration_router)
app.include_router(login_router)
app.include_router(patient_router)
app.include_router(clinic_router)


@app.get("/")
def root():
    return {"status": "Poetry e FastAPI configurados!"}
