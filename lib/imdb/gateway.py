from humps import decamelize
import requests

from lib.imdb.errors import IMDBError


class IMDBGateway:
    def __init__(self, url, token):
        self._url = url
        self._api_key = token

    def fetch_by_id(self, imdb_id):
        params = {
            'i': imdb_id,
            'apiKey': self._api_key
        }

        response = self._request(params)
        response = decamelize(response)
        is_request_successful = response['response'] == 'True'

        if not is_request_successful:
            raise IMDBError(response['error'])

        return response

    def _request(self, params):
        response = requests.get(self._url, params=params)
        return response.json()
