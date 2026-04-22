import pytest
from datetime import date
from fastapi.testclient import TestClient
from app.main import app
from app.models.patient_access import PatientAccess
from app.utils.security import hash_password
from app.models.address import Address
from app.models.person import Person
from app.core.database import get_db

@pytest.fixture(name="auth_overrides")
def auth_overrides(db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    yield
    app.dependency_overrides.clear()

@pytest.fixture(name="create_test_patient")
def create_test_patient(db_session):
    address = Address(state="SP", city="Sao Paulo", neighborhood="Centro", street="Rua Teste", number="123", cep="00000000")
    db_session.add(address)
    db_session.flush()

    person = Person(name="Paciente Teste", cpf="11122233344", sex="M", birthday=date(1990, 1, 1), address=address)
    db_session.add(person)
    db_session.flush()

    patient_access = PatientAccess(person=person, email="login@teste.com", password_hash=hash_password("senha123"), is_active=True)
    db_session.add(patient_access)
    db_session.flush()
    return patient_access

def test_login_success(auth_overrides, create_test_patient):
    client = TestClient(app)
    response = client.post(
        "/login/patient_access",
        json={"email": "login@teste.com", "password": "senha123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password(auth_overrides, create_test_patient):
    client = TestClient(app)
    response = client.post(
        "/login/patient_access",
        json={"email": "login@teste.com", "password": "SENHA_ERRADA"}
    )
    assert response.status_code == 401
    assert response.json()["detail"]["code"] == "INVALID_CREDENTIALS"

def test_login_user_not_found(auth_overrides):
    client = TestClient(app)
    response = client.post(
        "/login/patient_access",
        json={"email": "nao_existe@teste.com", "password": "qualquer_senha"}
    )
    assert response.status_code == 401
    assert response.json()["detail"]["code"] == "INVALID_CREDENTIALS"

def test_login_invalid_payload(auth_overrides):
    client = TestClient(app)
    response = client.post(
        "/login/patient_access",
        json={"email": "not-an-email", "password": ""}
    )
    assert response.status_code == 422
