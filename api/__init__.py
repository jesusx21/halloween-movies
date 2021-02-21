from api.resources.films import FilmsResource # noqa

class MoviesFreakApp:
    def __init__(self, app):
        self._app = app

    def install(self):
        database = self._app.get_database()
        movies_fetcher = self._app.get_movies_fetcher()

        self._app.register_resource('films', FilmsResource(database, movies_fetcher))
