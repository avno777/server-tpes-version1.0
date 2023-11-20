import mongoose from "mongoose";
import createCardModel from "../models/tenant/card.model.js";
import createCardEventModel from "../models/tenant/cardEvent.model.js";
import createElevatorModel from "../models/tenant/elevator.model.js";
import createManagerModel from "../models/tenant/manager.model.js";
import createTenantModel from "../models/tenant/user.model.js";
import { config } from "dotenv";
config();

const Admin = mongoose.mongo.Admin;

/**
 * 1. Connect local Mongo server and get all Database
 * 2. Match the DB name under username else create new DB
 * 3. Create Collection under new DB
 * @param {username} userDbName
 */
export function createDB(userDbName, cb) {
  const uri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
  const AdminDb = mongoose.createConnection(uri);

  AdminDb.on("open", function () {
    let dbExists;
    new Admin(AdminDb.db).listDatabases(function (err, result) {
      console.log("listDatabases succeeded");
      const allDatabases = result.databases;
      console.log(allDatabases);
      if (allDatabases.length > 0) {
        allDatabases.forEach((db) => {
          if (db.name === `${process.env.MONGODB_PREFIX}_${userDbName}`) {
            console.log(`DB ${db.name} is already exits.`);
            dbExists = true;
            cb(true);
          }
        });
        if (!dbExists) {
          const newUri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_PREFIX}${userDbName}`;
          console.log("Db Creating Process On...." + userDbName);
          const newUserDb = mongoose.createConnection(newUri);
          createCardModel(newUserDb);
          createCardEventModel(newUserDb);
          createElevatorModel(newUserDb);
          createManagerModel(newUserDb);
          createTenantModel(newUserDb);
          AdminDb.close();
          cb(false);
        }
      }
    });
  });
}
