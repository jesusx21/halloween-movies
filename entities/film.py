from entities.entity import Entity


class FilmEntity(Entity):
    def __init__(
            self, id=None, title=None, rated=None, released_at=None, duration=None, genre=None,
            director=None, plot=None, country=None, awards=None, poster=None, imdb_rating=None,
            imdb_id=None, production=None, website=None, streaming_app=None, created_at=None,
            updated_at=None
    ):
        super().__init__(id=id, created_at=created_at, updated_at=updated_at)

        self.title = title
        self.rated = rated
        self.released_at = released_at
        self.duration = duration
        self.genre = genre
        self.director = director
        self.plot = plot
        self.country = country
        self.awards = awards
        self.poster = poster
        self.imdb_rating = imdb_rating
        self.imdb_id = imdb_id
        self.production = production
        self.website = website
        self.streaming_app = streaming_app

    @property
    def as_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'rated': self.rated,
            'released_at': self.released_at,
            'duration': self.duration,
            'genre': self.genre,
            'director': self.director,
            'plot': self.plot,
            'country': self.country,
            'awards': self.awards,
            'poster': self.poster,
            'imdb_rating': self.imdb_rating,
            'imdb_id': self.imdb_id,
            'production': self.production,
            'website': self.website,
            'streaming_app': self.streaming_app,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
