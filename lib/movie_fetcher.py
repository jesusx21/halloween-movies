from datetime import datetime

from lib.imdb.gateway import IMDBGateway
from lib.imdb.errors import IMDBError
from lib.utelly.gateway import UtellyGateway


class MovieFetcher:
    def __init__(self, config):
        imdb_connection_data = config.get_imdb_connection_data()
        utelly_connection_data = config.get_utelly_connection_data()

        self._imdb_gateway = IMDBGateway(
            imdb_connection_data['url'], imdb_connection_data['api_key']
        )
        self._utelly_gateway = UtellyGateway(
            utelly_connection_data['url'], utelly_connection_data['api_key']
        )

    def fetch_by_imdb_id(self, imdb_id):
        imdb_data = self._imdb_gateway.fetch_by_id(imdb_id)
        utelly_data = self._utelly_gateway.fetch_by_imdb_id(imdb_id)

        streaming_app = utelly_data['collection']['locations'][0]
        streaming_app['external_id'] = streaming_app['id']

        del streaming_app['id']

        return {
            'title': imdb_data['title'],
            'rated': imdb_data['rated'],
            'released_at': imdb_data['released'],
            'duration': imdb_data['runtime'],
            'genre': imdb_data['genre'],
            'director': imdb_data['director'],
            'plot': imdb_data['plot'],
            'country': imdb_data['country'],
            'awards': imdb_data['awards'],
            'poster': imdb_data['poster'],
            'imdb_rating': imdb_data['imdb_rating'],
            'imdb_id': imdb_id,
            'production': imdb_data['production'],
            'website': imdb_data['website'],
            'streaming_app': streaming_app
        }

    def _format_released_date(self, string_released_date):
        [day, month, year] = '04 May 2012'.split(' ')

        day = int(day)
        year = int(year)

        map_month = {
            'Jan': 1,
            'Feb': 2,
            'Mar': 3,
            'Apr': 4,
            'May': 5,
            'Jun': 6,
            'Jul': 7,
            'Aug': 8,
            'Sep': 9,
            'Oct': 10,
            'Nov': 11,
            'Dec': 12
        }

        month = map_month[month]

        return datetime(year, month, day)
