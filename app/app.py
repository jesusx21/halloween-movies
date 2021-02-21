import falcon
from falcon.http_error import HTTPError as FalconHTTPError
from sqlalchemy import create_engine

from api.middlewares import ResponseLoggerMiddleware
from app.health_check import HealthCheck
from app.errors import HTTPError
from app.media import json_handler, json_only_error_serializer
from database import get_database
from lib.movie_fetcher import MovieFetcher


class MoviesFreak(falcon.App):
    def __init__(self, config):
        super().__init__(middleware=[ResponseLoggerMiddleware()])

        self._config = config
        self._engine = create_engine(self._config.get_sql_database_connection_url())

        self._database = get_database(self._engine)
        self._movie_fetcher = MovieFetcher(self._config)

        self._install_json_media_handler()
        self._install_health_check()
        self._add_custom_error_handlers()

        self.set_error_serializer(json_only_error_serializer)

    def get_database(self):
        return self._database

    def get_movies_fetcher(self):
        return self._movie_fetcher

    def register_resource(self, path, handler):
        self.add_route(f'/movies-freak/api/{path}/', handler)

    def _install_health_check(self):
        self.add_route('/movies-freak/api/health/', HealthCheck())

    def _install_json_media_handler(self):
        extra_handlers = {
            'application/json': json_handler,
        }

        self.req_options.media_handlers.update(extra_handlers)
        self.resp_options.media_handlers.update(extra_handlers)

    def _add_custom_error_handlers(self):
        self.add_error_handler(HTTPError, self._custom_http_error_handler)
        self.add_error_handler(FalconHTTPError, self._custom_falcon_http_error_handler)

    def _custom_http_error_handler(self, req, resp, error, params):
        self._compose_error_response(req, resp, error)

    def _custom_falcon_http_error_handler(self, req, resp, error, params):
        self._compose_error_response(req, resp, HTTPError.from_falcon_error(error))
