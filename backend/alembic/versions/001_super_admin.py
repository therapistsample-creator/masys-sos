"""Create Super Admin and enquiries tables."""
from alembic import op
import sqlalchemy as sa

revision = "001_super_admin"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table("super_admins", sa.Column("id", sa.BigInteger(), primary_key=True), sa.Column("name", sa.Text(), nullable=False), sa.Column("email", sa.Text(), nullable=False, unique=True), sa.Column("password", sa.Text(), nullable=False), sa.Column("phone", sa.Text()), sa.Column("role", sa.Text(), nullable=False, server_default="super-admin"), sa.Column("status", sa.String(20), nullable=False, server_default="active"), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_table("enquiries", sa.Column("id", sa.BigInteger(), primary_key=True), sa.Column("organisation", sa.Text(), nullable=False), sa.Column("contact", sa.Text(), nullable=False), sa.Column("email", sa.Text(), nullable=False), sa.Column("deployment_preference", sa.Text()), sa.Column("message", sa.Text()), sa.Column("date", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False), sa.Column("status", sa.String(30), nullable=False, server_default="New"), sa.Column("phone", sa.Text()), sa.Column("role", sa.Text()), sa.Column("service", sa.Text()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("enquiries_status_idx", "enquiries", ["status"])
    op.execute("INSERT INTO super_admins (name, email, password, phone, role, status) VALUES ('Tanu', 'iamtanujha@gmail.com', '$2b$12$gAgL.t67bzyhq2/BBQKCuuEdpMlUekrTCrhoONJv2zORPwrochEz6', '9350826298', 'super-admin', 'active')")


def downgrade():
    op.drop_index("enquiries_status_idx", table_name="enquiries")
    op.drop_table("enquiries")
    op.drop_table("super_admins")
