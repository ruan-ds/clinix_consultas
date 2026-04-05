# TIP 006 - Pytest

## Executar todos os testes
- poetry run pytest -v

## Verificar cobertura dos testes
- poetry run pytest --cov=app --cov-report=term-missing -v
(--cov=app → mede cobertura da pasta app/.
--cov-report=term-missing → mostra as linhas do código que não foram cobertas pelos testes.)

## Gerar relatório HTML de cobertura
- poetry run pytest --cov=app --cov-report=html -v