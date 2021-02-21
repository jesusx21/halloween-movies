class DatabaseError(Exception): pass # noqa
class InvalidData(DatabaseError): pass # noqa
class InvalidId(DatabaseError): pass # noqa
class EntityNotFound(DatabaseError): pass # noqa
class UnexpectedDatabaseError(DatabaseError): pass # noqa
