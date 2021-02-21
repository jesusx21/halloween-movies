import orjson

from falcon import media, MEDIA_JSON


json_handler = media.JSONHandler(
    dumps=orjson.dumps,
    loads=orjson.loads,
)


def json_only_error_serializer(req, resp, exception):
    preferred = req.client_prefers((MEDIA_JSON, ))

    if preferred is not None:
        resp.data = exception.to_json()
        resp.content_type = preferred

    resp.append_header('Vary', 'Accept')
