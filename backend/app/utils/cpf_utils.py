from typing import Optional


CPF_REGION = {
    0: ["RS"],
    1: ["DF", "GO", "MS", "MT", "TO"],
    2: ["AC", "AM", "AP", "PA", "RO", "RR"],
    3: ["CE", "MA", "PI"],
    4: ["AL", "PB", "PE", "RN"],
    5: ["BA", "SE"],
    6: ["MG"],
    7: ["ES", "RJ"],
    8: ["SP"],
    9: ["PR", "SC"]
}

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


def cpf_convert_numbers(cpf: str) -> str:
    return "".join(filter(str.isdigit, cpf))


def calculate_digit(numbers: list[int], start_weight: int) -> int:
    total = 0
    weight = start_weight

    for number in numbers:
        total += number * weight
        weight -= 1

    remainder = total % 11

    if remainder < 2:
        return 0

    return 11 - remainder


def cpf_validator(cpf: str) -> bool:
    cpf = cpf_convert_numbers(cpf)

    if len(cpf) != 11:
        return False

    if cpf == cpf[0] * 11:
        return False

    cpf_list = [int(i) for i in cpf]

    # Primeiro dígito verificador
    first_digit = calculate_digit(cpf_list[:9], 10)

    # Segundo dígito verificador
    second_digit = calculate_digit(cpf_list[:9] + [first_digit], 11)

    return (
        cpf_list[9] == first_digit
        and cpf_list[10] == second_digit
    )


def cpf_get_region(cpf: str) -> Optional[list]:
    if not cpf_validator(cpf):
        return None

    cpf = cpf_convert_numbers(cpf)
    return CPF_REGION[int(cpf[8])]


def test_valid_cpf():
    for cpf in CPF_FOR_TESTS:
        print(f"Testando CPF: {cpf} - Valid: {cpf_validator(cpf)}")


test_valid_cpf()