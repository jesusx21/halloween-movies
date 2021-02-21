from database.tables import Films, StreamingApps
from database.stores.store import Store
from database.errors import UnexpectedDatabaseError
from entities import FilmEntity


class FilmsStore(Store):
    def __init__(self, engine):
        super().__init__(engine, Films)

    def find_by_imdb_id(self, imdb_id):
        return self._find_one(column=Films.c.imdb_id, value=imdb_id)

    def _serialize(self, entity):
        data = super()._serialize(entity)

        del data['streaming_app']
        data['streaming_app_id'] = self._add_streaming_app(entity.streaming_app)

        return data

    def _deserialize(self, result):
        streaming_app = self._find_streaming_app_by_id(result['streaming_app_id'])

        data = super()._deserialize(result)
        return FilmEntity(
            id=data['id'],
            title=data['title'],
            rated=data['rated'],
            released_at=data['released_at'],
            duration=data['duration'],
            genre=data['genre'],
            director=data['director'],
            plot=data['plot'],
            country=data['country'],
            awards=data['awards'],
            poster=data['poster'],
            imdb_rating=data['imdb_rating'],
            imdb_id=data['imdb_id'],
            production=data['production'],
            website=data['website'],
            streaming_app=streaming_app,
            created_at=data['created_at'],
            updated_at=data['updated_at']
        )

    def _add_streaming_app(self, streaming_app):
        statement = StreamingApps \
            .insert() \
            .values(**streaming_app)

        try:
            cursor = self._execute(statement)
        except Exception as error:
            raise UnexpectedDatabaseError(error)

        return cursor.inserted_primary_key[0]

    def _find_streaming_app_by_id(self, streaming_app_id):
        statement = StreamingApps \
            .select() \
            .where(StreamingApps.c.id == streaming_app_id)

        try:
            cursor = self._execute(statement)
        except Exception as error:
            raise UnexpectedDatabaseError(error)

        return dict(cursor.first())
