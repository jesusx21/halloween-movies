from collections import OrderedDict

import falcon.status_codes as status
from falcon import MEDIA_JSON
from falcon.http_error import _DEFAULT_JSON_HANDLER


class HTTPError(Exception):
    def __init__(self, status, code, cause=None, headers=None):
        self.status = status
        self.code = code
        self.cause = cause
        self.headers = headers

    @staticmethod
    def from_falcon_error(error):
        if error.title:
            code = error.title.upper().replace(' ', '_')
        else:
            code = 'UNEXPECTED_ERROR'

        return HTTPError(error.status, code)

    def __repr__(self):
        return '<%s: %s>' % (self.__class__.__name__, self.status)

    __str__ = __repr__

    def to_dict(self, obj_type=dict):
        obj = obj_type()

        obj['code'] = self.code

        # TODO: Incude error cause in the serialization

        return obj

    def to_json(self, handler=None):
        obj = self.to_dict(OrderedDict)

        if handler is None:
            handler = _DEFAULT_JSON_HANDLER

        return handler.serialize(obj, MEDIA_JSON)


class HTTPBadRequest(HTTPError):
    def __init__(self, code, cause=None, headers=None):
        super().__init__(
            status.HTTP_400,
            code,
            cause,
            headers
        )


class HTTPUnauthorized(HTTPError):
    def __init__(self, code='UNAUTHORIZED', cause=None, headers=None):
        super().__init__(
            status.HTTP_401,
            code,
            cause,
            headers
        )


class HTTPForbidden(HTTPError):
    def __init__(self, code, cause=None, headers=None):
        super().__init__(
            status.HTTP_403,
            code,
            cause,
            headers
        )


class HTTPNotFound(HTTPError):
    def __init__(self, code, cause=None, headers=None):
        super().__init__(
            status.HTTP_404,
            code,
            cause,
            headers
        )


class HTTPConflict(HTTPError):
    def __init__(self, code, cause=None, headers=None):
        super().__init__(
            status.HTTP_409,
            code,
            cause,
            headers
        )


class HTTPInternalServerError(HTTPError):
    def __init__(self, code, cause=None, headers=None):
        if cause: print(cause)

        super().__init__(
            status.HTTP_500,
            code,
            cause,
            headers
        )
