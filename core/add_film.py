from core.errors import CouldNotAddFilm, FilmAlreadyAdded
from entities import FilmEntity
from database.errors import DatabaseError, EntityNotFound
from lib.imdb.gateway import IMDBGateway


class AddFilm:
    def __init__(self, database, movie_fetcher, imdb_id):
        self._database = database
        self._movie_fetcher = movie_fetcher
        self._imdb_id = imdb_id

    def execute(self):
        try:
            existent_movie = self._database.movies.find_by_imdb_id(self._imdb_id)

            if existent_movie:
                raise FilmAlreadyAdded(self._imdb_id)
        except EntityNotFound:
            pass


        movie_data = self._get_movie_data()
        movie_entity = FilmEntity(**movie_data)

        try:
            movie = self._database.movies.create(movie_entity)
        except DatabaseError as error:
            print('database', error)
            raise CouldNotAddFilm(error)

        return movie.as_dict

    def _get_movie_data(self):
        try:
            return self._movie_fetcher.fetch_by_imdb_id(self._imdb_id)
        except Exception as error:
            print('imdb', error)
            raise CouldNotAddFilm(error)
