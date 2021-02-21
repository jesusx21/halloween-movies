from app.app import MoviesFreak
from api import MoviesFreakApp


def create_app(config):
    print('Movies Freak Server Running')
    app = MoviesFreak(config)

    movies_freak_app = MoviesFreakApp(app)
    movies_freak_app.install()

    return app
