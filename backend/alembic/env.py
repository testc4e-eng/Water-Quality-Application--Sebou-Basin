# backend/alembic/env.py
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
from dotenv import load_dotenv
from configparser import ConfigParser

load_dotenv()

config = context.config
db_url = os.getenv("DATABASE_URL")
if db_url:
    config.set_main_option("sqlalchemy.url", db_url)

if config.config_file_name is not None:
    try:
        # Vérifie que les sections logging existent avant d'appeler fileConfig
        cp = ConfigParser()
        cp.read(config.config_file_name)
        if cp.has_section("formatters") and cp.has_section("handlers") and cp.has_section("loggers"):
            fileConfig(config.config_file_name, disable_existing_loggers=False)
        # sinon, on ignore tranquillement
    except Exception:
        # on ignore toute erreur de logging pour ne pas bloquer les migrations
        pass

from app.db.base import Base  # noqa
# Import "à vide" pour enregistrer les modèles dans Base.metadata
import app.models.user  # noqa
import app.models.item  # noqa
target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"})
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
