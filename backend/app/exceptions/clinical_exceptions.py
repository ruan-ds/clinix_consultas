from app.exceptions.patient_exceptions import business_error


def login_error() -> None:
    business_error(
        code="INVALID_CREDENTIALS",
        message="Usuário ou senha inválidos",
        status_code=401,
    )


def inactive_user_error() -> None:
    business_error(
        code="INACTIVE_USER",
        message="Usuário inativo",
        status_code=403,
    )


def unauthorized_origin_error() -> None:
    business_error(
        code="UNAUTHORIZED_ORIGIN",
        message="Origem não autorizada",
        status_code=403,
    )


def missing_origin_config_error() -> None:
    business_error(
        code="MISSING_ORIGIN_CONFIG",
        message="Configuração de origem clínica ausente",
        status_code=500,
    )


def invalid_token_error() -> None:
    business_error(
        code="INVALID_TOKEN",
        message="Token inválido",
        status_code=401,
    )


def missing_authorization_error() -> None:
    business_error(
        code="MISSING_AUTHORIZATION",
        message="Cabeçalho Authorization não enviado",
        status_code=401,
    )


def clinical_user_not_found_error() -> None:
    business_error(
        code="CLINICAL_USER_NOT_FOUND",
        message="Usuário clínico não encontrado ou inativo",
        status_code=401,
    )