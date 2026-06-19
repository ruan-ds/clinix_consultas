"""align patient-person inheritance and patient access relationships

Revision ID: 0557ff9ae30e
Revises: 57f53fce77c1
Create Date: 2026-06-07 18:47:15.871173

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0557ff9ae30e'
down_revision: Union[str, Sequence[str], None] = '57f53fce77c1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'patient',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(['id'], ['person.id'], name='fk_patient_id_person'),
        sa.PrimaryKeyConstraint('id', name='pk_patient')
    )

    op.execute(
        """
        INSERT INTO patient (id, is_active)
        SELECT DISTINCT pa.person_id, COALESCE(pa.is_active, TRUE)
        FROM patient_access pa
        ON CONFLICT (id) DO NOTHING
        """
    )

    op.add_column('patient_access', sa.Column('patient_id', sa.Integer(), nullable=True))
    op.execute(
        """
        UPDATE patient_access
        SET patient_id = person_id
        """
    )

    op.execute(
        """
        UPDATE medical_appointment ma
        SET patient_id = pa.patient_id
        FROM patient_access pa
        WHERE ma.patient_id = pa.id
        """
    )

    op.execute(
        """
        UPDATE dependent d
        SET dependent_patient_id = pa.patient_id
        FROM patient_access pa
        WHERE d.dependent_patient_id = pa.id
        """
    )
    op.execute(
        """
        UPDATE dependent d
        SET guardian_patient_id = pa.patient_id
        FROM patient_access pa
        WHERE d.guardian_patient_id = pa.id
        """
    )

    op.drop_constraint('dependent_dependent_patient_id_fkey', 'dependent', type_='foreignkey')
    op.drop_constraint('dependent_guardian_patient_id_fkey', 'dependent', type_='foreignkey')
    op.create_foreign_key('dependent_dependent_patient_id_fkey', 'dependent', 'patient', ['dependent_patient_id'], ['id'])
    op.create_foreign_key('dependent_guardian_patient_id_fkey', 'dependent', 'patient', ['guardian_patient_id'], ['id'])

    op.drop_constraint('medical_appointment_patient_id_fkey', 'medical_appointment', type_='foreignkey')
    op.create_foreign_key('medical_appointment_patient_id_fkey', 'medical_appointment', 'patient', ['patient_id'], ['id'])

    op.drop_constraint('uq_patient_access_person_id', 'patient_access', type_='unique')
    op.drop_constraint('fk_patient_access_person_id_person', 'patient_access', type_='foreignkey')
    op.create_unique_constraint('uq_patient_access_patient_id', 'patient_access', ['patient_id'])
    op.create_foreign_key('fk_patient_access_patient_id_patient', 'patient_access', 'patient', ['patient_id'], ['id'])
    op.alter_column('patient_access', 'patient_id', nullable=False)
    op.drop_column('patient_access', 'person_id')

    op.alter_column('clinic', 'is_active', existing_type=sa.BOOLEAN(), server_default=sa.true())
    op.alter_column('clinical_access', 'is_active', existing_type=sa.BOOLEAN(), server_default=sa.true())
    op.alter_column('clinix_access', 'is_active', existing_type=sa.BOOLEAN(), server_default=sa.true())
    op.alter_column('dependent', 'is_active', existing_type=sa.BOOLEAN(), server_default=sa.true())
    op.alter_column('doctor', 'is_active', existing_type=sa.BOOLEAN(), server_default=sa.true())
    op.alter_column('doctor_schedule_config', 'is_active', existing_type=sa.BOOLEAN(), server_default=sa.true())
    op.alter_column('medical_appointment', 'is_active', existing_type=sa.BOOLEAN(), server_default=sa.true())
    op.alter_column('patient_access', 'is_active', existing_type=sa.BOOLEAN(), server_default=sa.true())
    op.alter_column('service', 'is_active', existing_type=sa.BOOLEAN(), server_default=sa.true())

def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('patient_access', sa.Column('person_id', sa.Integer(), nullable=True))
    op.execute(
        """
        UPDATE patient_access
        SET person_id = patient_id
        """
    )

    op.execute(
        """
        UPDATE medical_appointment ma
        SET patient_id = pa.id
        FROM patient_access pa
        WHERE ma.patient_id = pa.patient_id
        """
    )

    op.execute(
        """
        UPDATE dependent d
        SET dependent_patient_id = pa.id
        FROM patient_access pa
        WHERE d.dependent_patient_id = pa.patient_id
        """
    )
    op.execute(
        """
        UPDATE dependent d
        SET guardian_patient_id = pa.id
        FROM patient_access pa
        WHERE d.guardian_patient_id = pa.patient_id
        """
    )

    op.drop_constraint('dependent_dependent_patient_id_fkey', 'dependent', type_='foreignkey')
    op.drop_constraint('dependent_guardian_patient_id_fkey', 'dependent', type_='foreignkey')
    op.create_foreign_key('dependent_dependent_patient_id_fkey', 'dependent', 'patient_access', ['dependent_patient_id'], ['id'])
    op.create_foreign_key('dependent_guardian_patient_id_fkey', 'dependent', 'patient_access', ['guardian_patient_id'], ['id'])

    op.drop_constraint('medical_appointment_patient_id_fkey', 'medical_appointment', type_='foreignkey')
    op.create_foreign_key('medical_appointment_patient_id_fkey', 'medical_appointment', 'patient_access', ['patient_id'], ['id'])

    op.drop_constraint('fk_patient_access_patient_id_patient', 'patient_access', type_='foreignkey')
    op.drop_constraint('uq_patient_access_patient_id', 'patient_access', type_='unique')
    op.create_foreign_key('fk_patient_access_person_id_person', 'patient_access', 'person', ['person_id'], ['id'])
    op.create_unique_constraint('uq_patient_access_person_id', 'patient_access', ['person_id'])
    op.alter_column('patient_access', 'person_id', nullable=False)
    op.drop_column('patient_access', 'patient_id')

    op.alter_column('service', 'is_active', existing_type=sa.BOOLEAN(), server_default=None)
    op.alter_column('patient_access', 'is_active', existing_type=sa.BOOLEAN(), server_default=None)
    op.alter_column('medical_appointment', 'is_active', existing_type=sa.BOOLEAN(), server_default=None)
    op.alter_column('doctor_schedule_config', 'is_active', existing_type=sa.BOOLEAN(), server_default=None)
    op.alter_column('doctor', 'is_active', existing_type=sa.BOOLEAN(), server_default=None)
    op.alter_column('dependent', 'is_active', existing_type=sa.BOOLEAN(), server_default=None)
    op.alter_column('clinix_access', 'is_active', existing_type=sa.BOOLEAN(), server_default=None)
    op.alter_column('clinical_access', 'is_active', existing_type=sa.BOOLEAN(), server_default=None)
    op.alter_column('clinic', 'is_active', existing_type=sa.BOOLEAN(), server_default=None)

    op.drop_table('patient')
