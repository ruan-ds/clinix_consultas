# TIP 001 - Poetry

## Fluxo básico Poetry
- poetry install (instalar as dependencias do poetry.lock)
- poetry add packageexemplo (adicionar dependencia)

## Manter o .venv na pasta do projeto
- poetry config virtualenvs.in-project true

## Rodar servidor
- poetry run uvicorn app.main:app --reload