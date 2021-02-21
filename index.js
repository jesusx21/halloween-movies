const buildApp = require('./infrastructure/app');
const config = require('./infrastructure/config');
const drivers = require('./infrastructure/database/drivers');
const buildDatabase = require('./interfaces/database');
const entities = require('./domain/entities');

async function initializeServer() {
  const db = drivers[config.database.driver];
  const database = buildDatabase(db, entities);

  const app = buildApp({
    database,
    port: config.server.port,
    host: config.server.host
  });

  await app.start()
    .then(() => {
      console.log('MOVIES FREAK SERVER INITIALIZED')
      console.log('Server runing on %s', app.info.uri);
    })
}

initializeServer();
