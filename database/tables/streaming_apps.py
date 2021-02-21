from datetime import datetime

from sqlalchemy.schema import Column, Table
from sqlalchemy.types import DateTime, Integer, String

from database.metadata import metadata


StreamingApps = Table(
    'streaming_apps',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('external_id', String(50), nullable=False),
    Column('name', String(150), nullable=False),
    Column('display_name', String(150), nullable=False),
    Column('url', String(250), nullable=False),
    Column('icon', String(250), nullable=False),
    Column('created_at', DateTime, default=datetime.now(), nullable=False),
    Column('updated_at', DateTime, default=datetime.now(), onupdate=datetime.now(), nullable=False)
)
