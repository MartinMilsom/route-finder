import { Db, MongoClient } from "mongodb";


export class Context {
  db: Db;
}

export class RoutesDatabase {
  dbClient: MongoClient;
  database: {db: Db};

  constructor(connection: string) {
      this.dbClient = new MongoClient(
          connection,
          {
              useNewUrlParser: true,
              useUnifiedTopology: true,
          });
  }

  connectToDb = async (): Promise<Context>  => {
      if (this.database) {
          return this.database;
      }

      let db: Db;
      try {
          if (!this.dbClient.isConnected()) {
              await this.dbClient.connect();
          }

          db = this.dbClient.db("routes");
      }
      catch (e) {
          console.log("--->error while connecting with graphql context (db)", e);
      }

      this.database = {db};
      return {db};
  };
}
