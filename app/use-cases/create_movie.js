class CreateMovie {
  constructor(database, data) {
    this._database = database;
    this._data = data
  }

  async execute() {
    let movie;

    try {
      movieEntity =
      movie = await this._database.movies.create()
    }
  }
}
