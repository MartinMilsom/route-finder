import { MongoClient } from 'mongodb';


export class RoutesDatabase {
  dbClient: MongoClient;
  database: any;

  constructor(connection: string) {
    this.dbClient = new MongoClient(
      connection,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  }

  connectToDb = async () => {
    if (this.database) {
      return this.database;
    }

    let db;
    try {
      if (!this.dbClient.isConnected()) {
        await this.dbClient.connect();
      }

      db = this.dbClient.db('routes');
    }
    catch (e) {
      console.log('--->error while connecting with graphql context (db)', e);
    }

    this.database = {db};
    return {db};
  };
}
