from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.inspection import inspect

class BaseModelMixin:
    # Mixin para adicionar compatibilidade Pydantic a todos os models SQLAlchemy
    
    def dict(self):
        """Converte objeto SQLAlchemy para dicionário"""
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
    
    @property
    def model_dump(self):
        # Compatibilidade com Pydantic v2
        return self.dict()
    
    def json(self):
        # Converte para JSON
        import json
        return json.dumps(self.dict(), default=str)

class Base(DeclarativeBase, BaseModelMixin):
    """Classe base para todos os models SQLAlchemy"""
    pass