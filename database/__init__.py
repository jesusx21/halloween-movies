from database.metadata import metadata # noqa
from database.stores import Database # noqa


def get_database(engine):
    database = Database(engine)

    return database
