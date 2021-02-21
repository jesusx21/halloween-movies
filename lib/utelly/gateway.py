import requests


class UtellyError(Exception): pass # noqa

class UtellyGateway:
    def __init__(self, url, token):
        self._url = url
        self._api_key = token

    def fetch_by_imdb_id(self, imdb_id):
        params = {
            'source_id': imdb_id,
            'source': 'imdb',
            'country': 'us'
        }
        headers = {
            'x-rapidapi-key': self._api_key,
            'x-rapidapi-host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
        }

        response = self._request(params, headers)

        print(self._api_key)
        if response['status_code'] != 200:
            raise UtellyError(response)

        return response

    def _request(self, params, headers):
        response = requests.request('GET', self._url, params=params, headers=headers)
        print(response.url)
        return response.json()
