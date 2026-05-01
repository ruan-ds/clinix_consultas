from app.api.public.registration import register_patient_access

from tests.test_cpf_test_dataset import CPF_FOR_TESTS

import random

import pytest


@pytest.fixture
def fresh_cpfs():
    return CPF_FOR_TESTS.copy()


def build_test_data(cpfs):
    if not cpfs:
        raise RuntimeError("Acabaram os CPFs de teste! Atualize CPF_FOR_TESTS.")
    
    cpf = random.choice(cpfs)
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
                "email": f"test{random.randint(1,1000)}@test.com",
                "password": "hello N45it"
            }
        }


def test_register_patient_access_route(client, fresh_cpfs):
    data = build_test_data(fresh_cpfs)
    response = client.post("/registration/patient_access", json=data)
    assert response.status_code == 200
    json_data = response.json()

    assert json_data["access"]["email"] == data["access"]["email"]    
    assert json_data["person"]["cpf"] == data["person"]["cpf"]    
    assert json_data["address"]["cep"] == data["address"]["cep"]    
    assert json_data["phone"]["phone"] == data["phone"]["phone"]



def test_duplicate_cpf_route(client, fresh_cpfs):
    data = build_test_data(fresh_cpfs)
    response1 = client.post("/registration/patient_access", json=data)
    assert response1.status_code == 200

    response2 = client.post("/registration/patient_access", json=data)
    assert response2.status_code == 400
    assert "cpf já cadastrado" in response2.json()["detail"]["message"].lower()


def test_login(client, fresh_cpfs):
    data = build_test_data(fresh_cpfs)

    response1 = client.post(
        "/registration/patient_access",
        json=data
    )
    print(response1.json())
    assert response1.status_code == 200

    login_data = data["access"]

    response2 = client.post(
        "/login/patient_access",
        json=login_data
    )
    assert response2.status_code == 200

    json_data = response2.json()

    assert "access_token" in json_data
    assert json_data["token_type"] == "bearer"

def test_login_wrong_password(client, fresh_cpfs):
    data = build_test_data(fresh_cpfs)

    client.post("/registration/patient_access", json=data)

    wrong_login = {
        "email": data["access"]["email"],
        "password": "senha_errada"
    }

    response = client.post("/login/patient_access", json=wrong_login)

    assert response.status_code == 401

def test_login_email_not_found(client, fresh_cpfs):
    response = client.post(
        "/login/patient_access",
        json={
            "email": "naoexiste@test.com",
            "password": "hello N45it"
        }
    )

    assert response.status_code in [400, 401, 404]