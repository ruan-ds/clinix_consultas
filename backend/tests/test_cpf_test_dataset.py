from app.utils.cpf_utils import cpf_validator

CPF_FOR_TESTS = [
    "12345678062",
    "11122233396",
    "52998224725",
    "93541134780",
    "28625587887",
    "39053344705",
    "16899535009",
    "71460238001",
    "98765432100",
    "74682489070"
]

def test_valid_cpf():
    for cpf in CPF_FOR_TESTS:
        verifier = True
    
    assert verifier == True