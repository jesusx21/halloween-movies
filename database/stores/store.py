from sqlalchemy.exc import IntegrityError, DataError
from contextlib import contextmanager

from database.errors import InvalidData, InvalidId, EntityNotFound, UnexpectedDatabaseError


class Store:
    def __init__(self, engine, table):
        self._engine = engine
        self._table = table

    def create(self, entity):
        data = self._serialize(entity)

        statement = self._table \
            .insert() \
            .values(**data)

        try:
            cursor = self._execute(statement)
        except IntegrityError as error:
            raise InvalidData(error, data)
        except Exception as error:
            raise UnexpectedDatabaseError(error)

        return self.find_by_id(cursor.inserted_primary_key[0])

    def find_by_id(self, entity_id):
        statement = self._table \
            .select() \
            .where(self._table.c.id == entity_id)

        try:
            cursor = self._execute(statement)
            result = cursor.first()
        except DataError:
            raise InvalidId(entity_id)
        except Exception as error:
            raise UnexpectedDatabaseError(error)

        if not result:
            raise EntityNotFound(entity_id)

        return self._deserialize(result)

    def _find_one(self, column=None, value=None):
        statement = self._table \
            .select() \
            .where(column == value)

        try:
            cursor = self._execute(statement)
            result = cursor.first()
        except DataError:
            raise InvalidData(column, value)
        except Exception as error:
            raise UnexpectedDatabaseError(error)

        if not result:
            raise EntityNotFound(column, value)

        return self._deserialize(result)

    def _execute(self, statement):
        with self._engine.connect() as connection:
            return connection.execute(statement)


    def _serialize(self, entity):
        data = entity.as_dict

        del data['id']
        del data['created_at']
        del data['updated_at']

        return data

    def _deserialize(self, result):
        return dict(result)
