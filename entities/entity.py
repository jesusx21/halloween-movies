from entities.errors import IdAlreadySet


class Entity:
    def __init__(self, id=None, created_at=None, updated_at=None):
        self._id = id
        self.created_at = created_at
        self.updated_at = updated_at

    @property
    def id(self):
        return self._id

    @id.setter
    def id(self, _id):
        if self._id:
            raise IdAlreadySet()

        self._id = id
