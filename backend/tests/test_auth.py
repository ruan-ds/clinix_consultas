from app.api.public.registration import register_patient_access

from app.utils.cpf_utils import CPF_FOR_TESTS

import random

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
                "email": f"test{random.randint(1,1000)}@test.com",
                "password": "hello N45it"
            }
        }


def test_register_patient_access_route(client):
    data = build_test_data()
    data["person"]["cpf"] = "12345678062"
    response = client.post("/registration/patient_access", json=data)
    assert response.status_code == 200
    json_data = response.json()

    assert json_data["access"]["email"] == data["access"]["email"]    
    assert json_data["person"]["cpf"] == data["person"]["cpf"]    
    assert json_data["address"]["cep"] == data["address"]["cep"]    
    assert json_data["phone"]["phone"] == data["phone"]["phone"]



def test_duplicate_cpf_route(client):
    data = build_test_data()
    data["person"]["cpf"] = "11122233396"
    response1 = client.post("/registration/patient_access", json=data)
    assert response1.status_code == 200

    response2 = client.post("/registration/patient_access", json=data)
    assert response2.status_code == 400
    assert "cpf já cadastrado" in response2.json()["detail"]["message"].lower()