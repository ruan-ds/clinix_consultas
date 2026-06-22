"""align patient-person inheritance and patient access relationships

Revision ID: 0557ff9ae30e
Revises: efc4193ebd94
Create Date: 2026-06-07 18:47:15.871173

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

revision: str = '0557ff9ae30e'
down_revision: Union[str, Sequence[str], None] = 'efc4193ebd94'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- patient: corrigir herança entity → person ---
    # efc4193ebd94 criou sem nome, Postgres gerou esses dois:
    op.drop_constraint('patient_id_fkey', 'patient', type_='foreignkey')
    op.drop_constraint('patient_person_id_fkey', 'patient', type_='foreignkey')
    op.drop_index(op.f('ix_patient_person_id'), table_name='patient')
    op.drop_column('patient', 'person_id')

    op.create_foreign_key(
        'fk_patient_id_person',
        'patient', 'person',
        ['id'], ['id']
    )

    # --- patient_access: person_id → patient_id ---
    op.add_column('patient_access', sa.Column('patient_id', sa.Integer(), nullable=True))

    # banco virgem: nenhum dado para migrar, só ajusta a estrutura
    op.drop_constraint('fk_patient_access_person_id_person', 'patient_access', type_='foreignkey')
    op.drop_constraint('uq_patient_access_person_id', 'patient_access', type_='unique')

    op.create_foreign_key(
        'fk_patient_access_patient_id_patient',
        'patient_access', 'patient',
        ['patient_id'], ['id']
    )
    op.create_unique_constraint('uq_patient_access_patient_id', 'patient_access', ['patient_id'])
    op.alter_column('patient_access', 'patient_id', nullable=False)
    op.drop_column('patient_access', 'person_id')


def downgrade() -> None:
    # --- patient_access: reverter ---
    op.add_column('patient_access', sa.Column('person_id', sa.Integer(), nullable=True))
    op.drop_constraint('fk_patient_access_patient_id_patient', 'patient_access', type_='foreignkey')
    op.drop_constraint('uq_patient_access_patient_id', 'patient_access', type_='unique')
    op.create_foreign_key(
        'fk_patient_access_person_id_person',
        'patient_access', 'person',
        ['person_id'], ['id']
    )
    op.create_unique_constraint('uq_patient_access_person_id', 'patient_access', ['person_id'])
    op.alter_column('patient_access', 'person_id', nullable=False)
    op.drop_column('patient_access', 'patient_id')

    # --- patient: reverter herança ---
    op.drop_constraint('fk_patient_id_person', 'patient', type_='foreignkey')
    op.add_column('patient', sa.Column('person_id', sa.Integer(), nullable=True))
    op.alter_column('patient', 'person_id', nullable=False)
    op.create_index(op.f('ix_patient_person_id'), 'patient', ['person_id'], unique=True)
    op.create_foreign_key(None, 'patient', 'entity', ['id'], ['id'])
    op.create_foreign_key(None, 'patient', 'person', ['person_id'], ['id'], ondelete='RESTRICT')