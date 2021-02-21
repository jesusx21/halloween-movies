from datetime import datetime

from unittest.mock import patch
from sqlalchemy import create_engine

from tests.medium import TestCase

from database.errors import InvalidData, InvalidId, EntityNotFound, UnexpectedDatabaseError
from entities.film import FilmEntity

class TestCreate(TestCase):
    def setUp(self):
        super().setUp()
        self.database = self.get_database()

    def test_create_film(self):
        film_entity = FilmEntity(
            title='Avengers',
            plot='A bunch of superheroes saving the world',
            watch_on='Disney+',
            released_at=datetime.now()
        )
        film = self.database.films.create(film_entity)

        self.assertIsInstance(film, FilmEntity)

        self.assertIsNotNone(film.id)
        self.assertIsNotNone(film.created_at)
        self.assertIsNotNone(film.updated_at)

        self.assertEqual(film.title, 'Avengers')
        self.assertEqual(film.plot, 'A bunch of superheroes saving the world')
        self.assertEqual(film.watch_on, 'Disney+')
        self.assertEqual(film.released_at, film_entity.released_at)

    def test_raises_error_when_creating_data_is_invalid(self):
        film_entity = FilmEntity(
            title='Avengers',
            plot=None,
            watch_on='Disney+',
            released_at=datetime.now()
        )

        with self.assertRaises(InvalidData):
            self.database.films.create(film_entity)

    def test_raises_error_when_creating_film_fails(self):
        film_entity = FilmEntity(
            title='Avengers',
            plot='A bunch of superheroes saving the world',
            watch_on='Disney+',
            released_at=datetime.now()
        )

        with patch.object(self.database.films, '_execute') as mock:
            mock.side_effect = Exception()

            with self.assertRaises(UnexpectedDatabaseError):
                self.database.films.create(film_entity)



class TestFindById(TestCase):
    def setUp(self):
        super().setUp()

        self.database = self.get_database()
        self.film = self._create_film()

    def test_find_by_id(self):
        film = self.database.films.find_by_id(self.film.id)

        self.assertIsInstance(film, FilmEntity)

        self.assertEqual(film.id, self.film.id)
        self.assertEqual(film.title, 'Avengers')
        self.assertEqual(film.plot, 'A bunch of superheroes saving the world')
        self.assertEqual(film.watch_on, 'Disney+')
        self.assertEqual(film.released_at, self.film.released_at)
        self.assertEqual(film.created_at, self.film.created_at)
        self.assertEqual(film.updated_at, self.film.updated_at)

    def test_find_by_id_raises_error_on_invalid_id(self):
        with self.assertRaises(InvalidId):
            self.database.films.find_by_id('self.film.id')

    def test_find_by_id_raises_error_when_film_does_not_exist(self):
        with self.assertRaises(EntityNotFound):
            self.database.films.find_by_id(1000)

    def test_find_by_id_raises_error_when_database_fails(self):
        with patch.object(self.database.films, '_execute') as mock:
            mock.side_effect = Exception()

            with self.assertRaises(UnexpectedDatabaseError):
                self.database.films.find_by_id(1)

    def _create_film(self):
        film = FilmEntity(
            title='Avengers',
            plot='A bunch of superheroes saving the world',
            watch_on='Disney+',
            released_at=datetime.now()
        )

        return self.database.films.create(film)
