const config = {
  public: {
    appName: 'APP-NAME',
  },
  private: {
    db: {
      uri: 'DB-URI',
      port: 27017,
      name: 'DB-NAME',
    },
    secret: 'YOUR-SECRET',
  },
};

config.private.db.connectionString = `mongodb://${config.private.db.uri}:${config.private.db.port}/${config.private.db.name}`;

module.exports = config;
