import random

from app.utils.cpf_utils import CPF_FOR_TESTS


def build_test_data():
    if not CPF_FOR_TESTS:
        raise RuntimeError("Acabaram os CPFs de teste! Atualize CPF_FOR_TESTS.")

    cpf = CPF_FOR_TESTS.pop(0)
    return {
        "person": {
            "name": "FRANCISCO CABRAL SOARES",
            "cpf": cpf,
            "sex": "M",
            "birthday": random.choice(["1990-01-01", "1985-05-15", "2000-12-31"])
        },
        "address": {
            "state": "SP",
            "city": "FRANCISCO MORATO",
            "neighborhood": "BELEM CAPELA",
            "street": "RUA DAS HORTENCIAS",
            "number": "175",
            "complement": "",
            "cep": "07991000"
        },
        "phone": {
            "phone": "31999999999",
            "type": "PESSOAL"
        },
        "access": {
            "email": f"login{random.randint(1001, 9999)}@test.com",
            "password": "hello N45it"
        }
    }


def test_login_success(client):
    data = build_test_data()
    register_response = client.post("/registration/patient_access", json=data)
    assert register_response.status_code == 200

    response = client.post("/login/patient_access", json={
        "email": data["access"]["email"],
        "password": data["access"]["password"]
    })

    assert response.status_code == 200
    json_data = response.json()
    assert "access_token" in json_data
    assert json_data["token_type"] == "bearer"


def test_login_invalid_password(client):
    data = build_test_data()
    register_response = client.post("/registration/patient_access", json=data)
    assert register_response.status_code == 200

    response = client.post("/login/patient_access", json={
        "email": data["access"]["email"],
        "password": "hello N45it ERRADO"
    })

    assert response.status_code == 401
    assert response.json()["detail"]["code"] == "INVALID_CREDENTIALS"


def test_login_user_not_found(client):
    response = client.post("/login/patient_access", json={
        "email": f"missing{random.randint(1001, 9999)}@test.com",
        "password": "hello N45it"
    })

    assert response.status_code == 401
    assert response.json()["detail"]["code"] == "INVALID_CREDENTIALS"


def test_login_invalid_payload(client):
    response = client.post("/login/patient_access", json={
        "email": "not-an-email",
        "password": ""
    })

    assert response.status_code == 422
