import humps
from falcon import HTTP_CREATED

from app.errors import HTTPConflict, HTTPInternalServerError
from core import AddFilm
from core.errors import CouldNotAddFilm, FilmAlreadyAdded


class FilmsResource:
    def __init__(self, database, films_fetcher):
        self._database = database
        self._films_fetcher = films_fetcher

    def on_post(self, req, resp):
        imdb_id = req.media['imdb_id']

        use_case = AddFilm(self._database, self._films_fetcher, imdb_id)

        try:
            film_added = use_case.execute()
        except FilmAlreadyAdded:
            raise HTTPConflict('MOVIE_ALREADY_ADDED')
        except CouldNotAddFilm as error:
            raise HTTPInternalServerError('UNEXPECTED_ERROR', error)
        except Exception as error:
            print(error)
            raise HTTPInternalServerError('UNEXPECTED_ERROR', error)

        resp.status = HTTP_CREATED
        resp.media = humps.camelize(film_added)
