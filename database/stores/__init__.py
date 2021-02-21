from database.stores.films import FilmsStore


class Database:
    def __init__(self, engine):
        self.films = FilmsStore(engine)
