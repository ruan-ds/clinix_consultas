"""add new relations between doctor, specialty and service

Revision ID: bdb2bdc3dd5d
Revises: 0557ff9ae30e
Create Date: 2026-06-16 00:35:32.496344

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'bdb2bdc3dd5d'
down_revision: Union[str, Sequence[str], None] = '0557ff9ae30e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'doctor_service',
        sa.Column('doctor_id', sa.Integer(), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['doctor_id'], ['doctor.id']),
        sa.ForeignKeyConstraint(['service_id'], ['service.id']),
        sa.PrimaryKeyConstraint('doctor_id', 'service_id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('doctor_service')
