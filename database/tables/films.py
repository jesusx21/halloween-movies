from datetime import datetime

from sqlalchemy.schema import Column, Table, ForeignKey
from sqlalchemy.types import DateTime, Integer, String

from database.metadata import metadata


Films = Table(
    'films',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('title', String(255), nullable=False),
    Column('rated', String(10)),
    Column('released_at', DateTime),
    Column('duration', String(10)),
    Column('genre', String(100)),
    Column('director', String(250)),
    Column('plot', String(750)),
    Column('country', String(15)),
    Column('awards', String(250)),
    Column('poster', String(250)),
    Column('imdb_rating', String(5)),
    Column('imdb_id', String(15)),
    Column('production', String(50)),
    Column('website', String(250)),
    Column('streaming_app_id', Integer, ForeignKey('streaming_apps.id'), nullable=False),
    Column('created_at', DateTime, default=datetime.now(), nullable=False),
    Column('updated_at', DateTime, default=datetime.now(), onupdate=datetime.now(), nullable=False)
)
