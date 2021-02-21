import unittest
from sqlalchemy import create_engine

from config import Config
from database import get_database
from database.metadata import metadata


class TestCase(unittest.TestCase):
    def setUp(self):
        self._engine = self._create_enginge()

        self.create_database()
        self.database = self.get_database()

    def tearDown(self):
        self.drop_database()

    def create_database(self):
        metadata.create_all(self._engine)

    def drop_database(self):
        metadata.drop_all(self._engine)

    def get_database(self):
        return get_database(self._engine)

    def _create_enginge(self):
        config_file_path = self.get_config_path()
        config = Config(config_file_path=config_file_path)

        return create_engine(config.get_sql_database_connection_url())

    def get_config_path(self):
        return 'config.ini'
