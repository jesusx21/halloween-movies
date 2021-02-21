from datetime import datetime

from tests.medium import TestCase

from core.add_movie import AddFilm, CouldNotAddFilm


class TestAddFilm(TestCase):
    def setUp(self):
        super().setUp()

        self.database = self.get_database()

    def test_add_movie(self):
        data = {
            'title': 'Avengers',
            'plot': 'A bunch of superheroes saving the world',
            'watch_on': 'Disney+',
            'released_at': datetime.now()
        }

        use_case = AddFilm(self.database, data)
        movie = use_case.execute()

        self.assertIsNotNone(movie['id'])
        self.assertIsNotNone(movie['created_at'])
        self.assertIsNotNone(movie['updated_at'])

        self.assertEqual(movie['title'], 'Avengers')
        self.assertEqual(movie['plot'], 'A bunch of superheroes saving the world')
        self.assertEqual(movie['watch_on'], 'Disney+')
        self.assertEqual(movie['released_at'], data['released_at'])

    def test_add_movie_raises_error_on_database_error(self):
        data = {
            'title': 'Avengers',
            'plot': None,
            'watch_on': 'Disney+',
            'released_at': datetime.now()
        }

        use_case = AddFilm(self.database, data)

        with self.assertRaises(CouldNotAddFilm):
            use_case.execute()
