def cnpj_convert_numbers(cnpj: str) -> str:
    return "".join(filter(str.isdigit, cnpj))

def calculate_cnpj_digit(numbers: list[int], weights: list[int]) -> int:
    total = 0
    for i in range(len(numbers)):
        total += numbers[i] * weights[i]
    
    remainder = total % 11
    if remainder < 2:
        return 0
    return 11 - remainder

def cnpj_validator(cnpj: str) -> bool:
    cnpj = cnpj_convert_numbers(cnpj)

    if len(cnpj) != 14 or cnpj == cnpj[0] * 14:
        return False

    cnpj_list = [int(i) for i in cnpj]

    weights_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    weights_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    first_digit = calculate_cnpj_digit(cnpj_list[:12], weights_1)
    second_digit = calculate_cnpj_digit(cnpj_list[:12] + [first_digit], weights_2)

    return (
        cnpj_list[12] == first_digit and
        cnpj_list[13] == second_digit
    )
